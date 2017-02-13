import { Flow as VF } from "vexflow";
import { Clef, KeySignature, Measure, NoteEvent, TimeSignature } from "../models";

export class Renderer {
    private vfStave: VF.Stave; // todo: remove
    private vfVoices: VF.Voice[] = []; // todo: remove
    private x = 120;
    private y = 80;
    private currentTimeSignature = new TimeSignature(4, 4);
    private currentGroupEl;

    private completedNotes: NoteEvent[] = [];

    public drawMeasure(
        vfFactory: VF.Factory,
        x: number,
        y: number,
        measure: Measure,
        shouldAddClef = false,
    ) {
        let width = 150;
        if (shouldAddClef) width += 20;
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
                .addClef(clef);

            vfStaves.push(vfStave);
        });

        system.format();
        vfStaves.forEach(vfStave => vfStave.draw());
        clefs.forEach(clef => clefToVfVoices[clef].forEach(vfVoice => vfVoice.draw()));
    }

    private getVfNotesForLength(quarterNoteCount: VF.Fraction, rest = false, keys = ["b/4"]): VF.StaveNote[] {
        const clef = 'treble'; // TODO: factor out!!
        let durations;

        // will have to factor
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
        const restLength = end.subtract(start);

        if (restLength.greaterThan(0, 1)) {
            return this.getVfNotesForLength(restLength, true);
        } else {
            return [];
        }
    }

    private mapNotes(completed: NoteEvent[], pending: NoteEvent[], measureLength = new VF.Fraction(4, 1)): VF.StaveNote[] {
        console.log("completed", completed);
        let vfNotes = [];
        let lastBeat = new VF.Fraction(0, 1);

        // Need to keep track of current beat to break up notes appropriately
        // http://music.indiana.edu/departments/academic/composition/style-guide/index.shtml#rhythm
        completed.forEach(note => {
            
            // Idk about this
            const restLength = note.quantizedOn.asFraction().subtract(lastBeat).subtract(note.beatsPending, 1);

            if (restLength.greaterThan(0, 1)) {
                const rests = this.getVfNotesForLength(restLength, true);
                vfNotes.push(...rests);
            }
            // end idk about this

            lastBeat = lastBeat.add(restLength);

            const noteDivisionLength = note.quantizedOff.asFraction().subtract(note.quantizedOn.asFraction());
            const notes = this.getVfNotesForLength(noteDivisionLength);
            vfNotes.push(...notes);

            lastBeat = lastBeat.add(noteDivisionLength);
        });

        vfNotes.push(...this.getVfRests(lastBeat, measureLength));

        console.log('vfNotes', vfNotes);

        return vfNotes;
    }
}
