const VF = require("vexflow").Flow;
import { Vex } from "vexflow";
import { Note } from "../rhythm-input";
import { Clef, KeySignature, TimeSignature } from "../models";

export class Renderer {
    private vfContext;
    private vfStave: Vex.Flow.Stave;
    private vfVoices: Vex.Flow.Voice[] = [];
    private x = 120;
    private y = 80;
    private currentTimeSignature = new TimeSignature(4, 4);
    private currentGroupEl;

    private completedNotes: Note[] = [];

    constructor(
        private elementId: string
    ) {
        // Create an SVG renderer and attach it to the DIV element named "boo".
        const div = document.getElementById(this.elementId);
        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

        // Configure the rendering context.
        renderer.resize(800, 600);
        this.vfContext = renderer.getContext();

        // Create a stave of width 400 at position 10, 40 on the canvas.
        this.vfStave = new VF.Stave(10, 40, 400);

        // Add a clef and time signature.
        this.vfStave.addClef("treble").addTimeSignature("4/4");

        // Connect it to the rendering context and draw!
        this.vfStave.setContext(this.vfContext).draw();

        // Create a voice in 4/4 and add above notes
        const voice = new VF.Voice({num_beats: 4,  beat_value: 4});
        this.vfVoices.push(voice);
    }

    public render(completed, pending, timeSigChange = null, keySigChange = null) {
        this.completedNotes.push(...completed);

        console.log("in", completed);
        const vfNotes = this.mapNotes(completed);
        console.log("out", vfNotes);
        const voice = new VF.Voice({num_beats: 4,  beat_value: 4});
        voice.addTickables(vfNotes);

        const voices = [ voice ];

        // Format and justify the notes to 400 pixels.
        const formatter = new VF.Formatter().joinVoices(voices).format(voices, 400);

        if (this.currentGroupEl) this.currentGroupEl.remove();

        this.currentGroupEl = this.vfContext.openGroup('g');
        voice.draw(this.vfContext, this.vfStave);
        this.vfContext.closeGroup('g');
    }

    private drawMeasure(
        x: number,
        y: number,
        clef: Clef,
        keySigChange = null,
        timeSigChange: TimeSignature = null,
        voices: Vex.Flow.Voice[]
    ) {
        let width = 150;
        if (keySigChange) width += 35;
        if (timeSigChange) width += 35;

        const system = Vex.Flow.System({ x, y, width: width, spaceBetweenStaves: 10 });

        if (keySigChange) {
            system.addClef(clef);
            system.addKeySignature(keySigChange.toVfKeySpec());
        }

        if (timeSigChange) {
            system.addTimeSignature(timeSigChange.toVfTimeSpec());
        }

        system.addStave();

        system.setContext(this.vfContext);
    }

    private getRests(notes: Note[]) {
        let totalDivisions = 0;
        notes.forEach(note => {
        });
    }

    private getVfNotesForLength(divisionLength: number, rest = false, keys = ["b/4"]): Vex.Flow.StaveNote[] {
        let durations;

        // will have to factor
        if (divisionLength === 1) {
            durations = ['4'];
        } else if (divisionLength === 2) {
            durations = ['2'];
        } else if (divisionLength === 3) {
            durations = ['2d'];
        } else if (divisionLength === 4) {
            durations = ['1'];
        } else {
            throw new Error("Not implemented yet: divisionLength = " + divisionLength);
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
        let lastDivision = 0;
        let vfNotes = [];

        // Need to keep track of current beat
        // http://music.indiana.edu/departments/academic/composition/style-guide/index.shtml#rhythm
        notes.forEach(note => {
            const restDivisionLength = note.quantizedOn.division - lastDivision;

            if (restDivisionLength > 0) {
                const rests = this.getVfNotesForLength(restDivisionLength, true);
                vfNotes.push(...rests);
            }

            const noteDivisionLength = note.quantizedOff.division - note.quantizedOn.division;
            const notes = this.getVfNotesForLength(noteDivisionLength);
            vfNotes.push(...notes);

            lastDivision = note.quantizedOff.division;
        });

        return vfNotes;
    }
}
