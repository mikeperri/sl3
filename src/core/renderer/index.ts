const VF = require("vexflow").Flow;
import { Vex } from "vexflow";
import { Note } from "../rhythm-input";
import { Clef, KeySignature, TimeSignature } from "../models";
import { Fraction } from "../util/fraction";

export class Renderer {
    private vfFactory;
    private vfContext;
    private vfStave: Vex.Flow.Stave; // todo: remove
    private vfVoices: Vex.Flow.Voice[] = []; // todo: remove
    private x = 120;
    private y = 80;
    private currentTimeSignature = new TimeSignature(4, 4);
    private currentGroupEl;

    private completedNotes: Note[] = [];

    constructor(
        private elementId: string
    ) {
        // Create an SVG renderer and attach it to the DIV element named "boo".
        this.vfFactory = new VF.Factory({
            renderer: {
                selector: this.elementId,
                width: 800,
                height: 600
            }
        });
        this.vfContext = this.vfFactory.getContext();

        // this.drawMeasure(this.x, this.y, [], 'treble');
    }

    public render(completed, pending, timeSigChange = null, keySigChange = null) {
        this.drawMeasure(this.x, this.y, completed, null, null, null);
    }

    private drawMeasure(
        x: number,
        y: number,
        notes: Note[] = [],
        clef: Clef,
        keySigChange: KeySignature = null,
        timeSigChange: TimeSignature = null,
    ) {
        let width = 150;
        if (keySigChange) width += 35;
        if (timeSigChange) width += 35;

        const system = new VF.System({ x, y, width: width, spaceBetweenStaves: 10, factory: this.vfFactory });
        system.setContext(this.vfContext);

        if (keySigChange) {
            system.addClef(clef);
            system.addKeySignature(keySigChange.toVfKeySpec());
        }

        if (timeSigChange) {
            system.addTimeSignature(timeSigChange.toVfTimeSpec());
        }

        const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
        voice.addTickables(this.mapNotes(notes));
        voice.mode = VF.Voice.Mode['FULL'];

        const voices = [ voice ];

        const stave = system.addStave({ voices, debugNoteMetrics: true });
        stave.draw();
        system.format();
        voice.draw();
    }

    private getVfRests(notes: Note[]) {
        let totalDivisions = 0;
        notes.forEach(note => {
        });
    }

    private getVfNotesForLength(quarterNoteCount: Vex.Flow.Fraction, rest = false, keys = ["b/4"]): Vex.Flow.StaveNote[] {
        let durations;

        // will have to factor
        if (quarterNoteCount.equals(new Fraction(1, 4))) {
            durations = ['16'];
        } else if (quarterNoteCount.equals(new Fraction(1, 2))) {
            durations = ['8'];
        } else if (quarterNoteCount.equals(new Fraction(3, 4))) {
            durations = ['8d'];
        } else if (quarterNoteCount.equals(new Fraction(1, 1))) {
            durations = ['4'];
        } else if (quarterNoteCount.equals(new Fraction(2, 1))) {
            durations = ['2'];
        } else if (quarterNoteCount.equals(new Fraction(3, 1))) {
            durations = ['2d'];
        } else if (quarterNoteCount.equals(new Fraction(4, 1))) {
            durations = ['1'];
        } else {
            throw new Error("Not implemented yet: quarterNoteCount = " + quarterNoteCount);
        }

        if (rest) {
            durations = durations.map(d => d + "r");
        }

        return durations.map(duration => {
            const vfNote = new VF.StaveNote({ clef: "treble", keys, duration });
            if (duration.endsWith('d')) {
                vfNote.addDotToAll();
            }
            return vfNote;
        });
    }

    private mapNotes(notes: Note[]): Vex.Flow.StaveNote[] {
        let lastDivision = new Fraction(0, 1);
        let vfNotes = [];

        // Need to keep track of current beat to break up notes appropriately
        // http://music.indiana.edu/departments/academic/composition/style-guide/index.shtml#rhythm
        notes.forEach(note => {
            const restDivisionLength = note.quantizedOn.asFraction().subtract(lastDivision).add(note.beatsPending, 1);
            console.log('rest length', restDivisionLength);

            if (restDivisionLength.greaterThan(0, 1)) {
                const rests = this.getVfNotesForLength(restDivisionLength, true);
                vfNotes.push(...rests);
            }

            const noteDivisionLength = note.quantizedOff.asFraction().subtract(note.quantizedOn.asFraction());
            const notes = this.getVfNotesForLength(noteDivisionLength);
            vfNotes.push(...notes);

            lastDivision = note.quantizedOff.asFraction();
        });

        console.log('vfNotes', vfNotes);

        return vfNotes;
    }
}
