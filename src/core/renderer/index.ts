import { Flow as VF } from "vexflow";
import { Clef, KeySignature, Measure, Note, RendererMeasure, TimeSignature } from "../models";

export class Renderer {
    public drawMeasure(
        vfFactory: VF.Factory,
        rendererMeasure: RendererMeasure,
    ) {
        const { measure, x, y, startsLine } = rendererMeasure;

        if (rendererMeasure.element) {
            console.log("need to erase", rendererMeasure.element);
            rendererMeasure.element.remove();
        }

        let width = 200;
        if (startsLine) width += 20;
        if (measure.keySigChange) width += 20;
        if (measure.timeSigChange) width += 20;

        const system = new VF.System({ x, y, width: width, spaceBetweenStaves: 10, factory: vfFactory });
        system.setContext(vfFactory.getContext());

        if (measure.keySigChange) {
            system.addKeySignature(measure.keySigChange.toVfKeySpec());
        }

        if (measure.timeSigChange) {
            system.addTimeSignature(measure.timeSigChange.toVfTimeSpec());
        }

        const clefsAndVfVoices = measure.voices.map(voice => {
            const vfVoice = new VF.Voice({ num_beats: 4, beat_value: 4 });
            vfVoice.addTickables(this.mapNotes(voice.completed, voice.pending));
            return { clef: voice.clef, vfVoice };
        });

        const clefToVfVoices = {};
        clefsAndVfVoices.forEach(({ clef, vfVoice }) => {
            if (!clefToVfVoices[clef]) {
                clefToVfVoices[clef] = [];
            }
            clefToVfVoices[clef].push(vfVoice);
        });

        const vfStaves = [];
        const clefs = Object.keys(clefToVfVoices);
        clefs.forEach(clef => {
            const vfVoices = clefToVfVoices[clef];
            const vfStave = system.addStave({ voices: vfVoices })
            if (startsLine) vfStave.addClef(clef);

            vfStaves.push(vfStave);
        });

        const element = system.getContext().openGroup('measure');
        system.format();
        vfStaves.forEach(vfStave => vfStave.draw());
        clefs.forEach(clef => clefToVfVoices[clef].forEach(vfVoice => vfVoice.draw()));
        system.getContext().closeGroup('measure');

        rendererMeasure.element = element;
        rendererMeasure.width = width;
    }

    private getFractionAndRemainder(quarterNoteCount, noteLength) {
        const quotient = quarterNoteCount.clone().divide(noteLength);
    }

    private getVfNotesForLength(quarterNoteCount: VF.Fraction, rest = false, keys = ["b/4"]): VF.StaveNote[] {
        const clef = 'treble'; // TODO: factor out!!
        let durations = [];

        // factor

        if (quarterNoteCount.equals(new VF.Fraction(1, 4))) {
            durations = ['16'];
        } else if (quarterNoteCount.equals(new VF.Fraction(1, 2))) {
            durations = ['8'];
        } else if (quarterNoteCount.equals(new VF.Fraction(3, 4))) {
            durations = ['8d'];
        } else if (quarterNoteCount.equals(new VF.Fraction(1, 1))) {
            durations = ['4'];
        } else if (quarterNoteCount.equals(new VF.Fraction(2, 1))) {
            durations = ['2'];
        } else if (quarterNoteCount.equals(new VF.Fraction(3, 1))) {
            durations = ['2d'];
        } else if (quarterNoteCount.equals(new VF.Fraction(4, 1))) {
            durations = ['1'];
        } else if (quarterNoteCount.equals(new VF.Fraction(5, 4))) {
            durations = ['4', '16'];
        } else {
            throw new Error("Not implemented yet: quarterNoteCount = " + quarterNoteCount);
        }

        if (rest) {
            durations = durations.map(d => d + "r");
        }

        return durations.map(duration => {
            const vfNote = new VF.StaveNote({ clef, keys, duration });
            if (vfNote.dots > 0) {
                vfNote.addDotToAll();
            }
            return vfNote;
        });
    }

    private getVfRests(start: VF.Fraction, end: VF.Fraction) {
        const restLength = end.clone().subtract(start);

        if (restLength.greaterThan(0, 1)) {
            return this.getVfNotesForLength(restLength, true);
        } else {
            return [];
        }
    }

    private mapNotes(completed: Note[], pending: Note[], measureLength = new VF.Fraction(4, 1)): VF.StaveNote[] {
        console.log("completed", completed);
        let vfNotes = [];
        let lastBeat = new VF.Fraction(0, 1);

        // Need to keep track of current beat to break up notes appropriately
        // http://music.indiana.edu/departments/academic/composition/style-guide/index.shtml#rhythm
        completed.forEach(note => {
            vfNotes.push(...this.getVfRests(lastBeat, note.on));

            const noteLength = note.off.clone().subtract(note.on);
            vfNotes.push(...this.getVfNotesForLength(noteLength));

            lastBeat = note.off.clone();
        });

        vfNotes.push(...this.getVfRests(lastBeat, measureLength));

        console.log('vfNotes', vfNotes);

        return vfNotes;
    }
}
