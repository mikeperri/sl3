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

        const allVfTies = [];
        const clefsAndVfVoices = measure.voices.map(voice => {
            const vfVoice = new VF.Voice({ num_beats: 4, beat_value: 4 });
            const { vfNotes, vfTies } = this.mapNotes(voice.clef, voice.completed, voice.pending)
            vfVoice.addTickables(vfNotes);
            allVfTies.push(...vfTies);
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
        allVfTies.forEach(vfTie => vfTie.setContext(system.getContext()).draw());
        system.getContext().closeGroup('measure');

        rendererMeasure.element = element;
        rendererMeasure.width = width;
    }

    private getDivisionPoints(start: VF.Fraction, end: VF.Fraction) {
        let points: VF.Fraction[] = [];
        if (start.denominator >= 4 && start.denominator > end.denominator) {
            const point = new VF.Fraction(Math.ceil(start.numerator / 4), start.denominator / 4)
            while(point.lessThan(end)) {
                points.push(point.clone());
                point.add(1, point.denominator);
            }
        } else if (end.denominator >= 4) {
            const point = new VF.Fraction(Math.floor(end.numerator / 4), end.denominator / 4);
            while(point.greaterThan(start)) {
                points.push(point.clone());
                point.subtract(1, point.denominator);
            }
            points.reverse();
        }
        return points;
    }

    private splitAtDivisionPoints(start: VF.Fraction, end: VF.Fraction, divisionPoints: VF.Fraction[]): string[] {
        let pointsInRange: VF.Fraction[] = [ start ];
        divisionPoints.forEach(divisionPoint => {
            if (divisionPoint.greaterThan(start) && divisionPoint.lessThan(end)) {
                pointsInRange.push(divisionPoint);
            }
        });
        pointsInRange.push(end);

        let durations = [];
        for (var i = 1; i < pointsInRange.length; i++) {
            const length = pointsInRange[i].clone().subtract(pointsInRange[i - 1]);
            durations.push(...this.lengthToVfDurations(length));
        }
        return durations;
    }


    private lengthToVfDurations(length: VF.Fraction): string[] {
        if (length.equals(new VF.Fraction(1, 4))) {
            return ['16'];
        } else if (length.equals(new VF.Fraction(1, 2))) {
            return ['8'];
        } else if (length.equals(new VF.Fraction(3, 4))) {
            return ['8d'];
        } else if (length.equals(new VF.Fraction(1, 1))) {
            return ['4'];
        } else if (length.equals(new VF.Fraction(2, 1))) {
            return ['2'];
        } else if (length.equals(new VF.Fraction(3, 1))) {
            return ['2d'];
        } else if (length.equals(new VF.Fraction(4, 1))) {
            return ['1'];
        } else if (length.equals(new VF.Fraction(5, 4))) {
            return ['4', '16'];
        } else if (length.equals(new VF.Fraction(3, 2))) {
            return ['4d'];
        } else if (length.equals(new VF.Fraction(5, 2))) {
            return ['4', '4', '8'];
        } else if (length.equals(new VF.Fraction(7, 2))) {
            return ['4', '4', '4', '8'];
        } else {
            throw new Error("Not implemented yet: quarterNoteCount = " + length);
        }
    }

    private getVfNotesForLength(clef: Clef, start: VF.Fraction, end: VF.Fraction, rest = false, keys = null): { vfNotes: VF.StaveNote[], vfTies: VF.StaveTie[] } {
        const length = end.clone().subtract(start);
        if (!keys) {
            keys = clef === "treble" ? ["b/4"] : ["d/3"];
        }

        // Need to break up notes appropriately
        // http://music.indiana.edu/departments/academic/composition/style-guide/index.shtml#rhythm
        start.simplify();
        end.simplify();
        console.log("start", start, "end", end);

        // Find boundaries for division
        const divisionPoints = this.getDivisionPoints(start, end);
        if (divisionPoints) {
            console.log("division point", ...divisionPoints);
        }

        let durations = this.splitAtDivisionPoints(start, end, divisionPoints);
        console.log("split", durations);

        if (rest) {
            durations = durations.map(d => d + "r");
        }

        const vfNotes = durations.map(duration => {
            const vfNote = new VF.StaveNote({ clef, keys, duration });
            if (vfNote.dots > 0) {
                vfNote.addDotToAll();
            }
            return vfNote;
        });

        const vfTies: VF.StaveTie[] = [];
        if (vfNotes.length > 1 && !rest) {
            // Add ties
            for (var i = 1; i < vfNotes.length; i++) {
                vfTies.push(new VF.StaveTie({
                    first_note: vfNotes[i - 1],
                    last_note: vfNotes[i],
                    first_indices: [ 0 ],
                    last_indices: [ 0 ],
                }));
            }
        }

        return { vfNotes, vfTies };
    }

    private getVfRests(clef: Clef, start: VF.Fraction, end: VF.Fraction) {
        const restLength = end.clone().subtract(start);

        if (restLength.greaterThan(0, 1)) {
            return this.getVfNotesForLength(clef, start, end, true).vfNotes;
        } else {
            return [];
        }
    }

    private mapNotes(clef: Clef, completed: Note[], pending: Note[], measureLength = new VF.Fraction(4, 1)): { vfNotes: VF.StaveNote[], vfTies: VF.StaveTie[] } {
        console.log("completed", completed);
        let allVfNotes = [];
        let allVfTies = [];
        let lastBeat = new VF.Fraction(0, 1);

        completed.forEach(note => {
            allVfNotes.push(...this.getVfRests(clef, lastBeat, note.on));
            const { vfNotes, vfTies } = this.getVfNotesForLength(clef, note.on, note.off);
            allVfNotes.push(...vfNotes);
            allVfTies.push(...vfTies);
            lastBeat = note.off.clone();
        });

        allVfNotes.push(...this.getVfRests(clef, lastBeat, measureLength));

        console.log('vfNotes', allVfNotes);

        return { vfNotes: allVfNotes, vfTies: allVfTies };
    }
}
