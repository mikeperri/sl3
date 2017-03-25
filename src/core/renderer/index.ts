import { Flow as VF } from "vexflow";
import { Clef, KeySignature, Measure, FractionalNote, RendererMeasure, TimeSignature, Tuplet } from "../models";
import { RendererHelpers, VfNoteAndTuplet } from "./helpers";

export class Renderer {
    private vfFactory: VF.Factory;

    constructor(hostElementId: string) {
        this.vfFactory = new VF.Factory({
            renderer: {
                selector: hostElementId,
                width: 800,
                height: 600
            }
        });
    }

    public drawMeasure(
        rendererMeasure: RendererMeasure,
        prevRendererMeasure: RendererMeasure,
    ) {
        const { measure, x, y, startsLine } = rendererMeasure;

        if (rendererMeasure.element) {
            rendererMeasure.element.remove();
        }

        let width = 200;
        if (startsLine) width += 20;
        if (measure.keySigChange) width += 20;
        if (measure.timeSigChange) width += 20;

        const system = new VF.System({ x, y, width: width, spaceBetweenStaves: 10, factory: this.vfFactory });
        system.setContext(this.vfFactory.getContext());

        if (measure.keySigChange) {
            system.addKeySignature(measure.keySigChange.toVfKeySpec());
        }

        if (measure.timeSigChange) {
            system.addTimeSignature(measure.timeSigChange.toVfTimeSpec());
        }

        const allVfTies = [];
        const allVfTuplets: VF.Tuplet[] = [];
        const clefsAndVfVoices = measure.voices.map((voice, voiceIndex) => {
            const vfNotesToTieForward = prevRendererMeasure ? prevRendererMeasure.voicesToTieForward[voiceIndex] : null;
            const measureLength = 4;
            const vfVoice = new VF.Voice({ num_beats: measureLength, beat_value: 4 }).setMode(VF.Voice.Mode.SOFT);

            const vfNotes: VF.StaveNote[] = [];
            const vfTies: VF.StaveTie[] = [];
            const vfNotesToTieBackward: VF.StaveNote[] = [];
            const vfNotesForCurrentTuplet: VF.StaveNote[] = [];
            let lastBeat = new VF.Fraction(0, 1);
            let currentTuplet = null;

            voice.completed.forEach(note => {
                const restVfNotesAndTuplets = RendererHelpers.getVfNotesForLength(voice.clef, lastBeat, note.on, true).vfNotesAndTuplets;
                currentTuplet = this.handleVfNotesAndTuplets(restVfNotesAndTuplets, vfNotes, allVfTuplets, vfNotesForCurrentTuplet, currentTuplet);

                const { vfNotesAndTuplets: noteVfNotesAndTuplets, vfTies } = RendererHelpers.getVfNotesForLength(voice.clef, note.on, note.off);
                currentTuplet = this.handleVfNotesAndTuplets(noteVfNotesAndTuplets, vfNotes, allVfTuplets, vfNotesForCurrentTuplet, currentTuplet);
                vfTies.push(...vfTies);

                if (note.tieForward) {
                    if (!rendererMeasure.voicesToTieForward[voiceIndex]) rendererMeasure.voicesToTieForward[voiceIndex] = [];
                    rendererMeasure.voicesToTieForward[voiceIndex].push(vfNotes[vfNotes.length - 1]);
                }

                if (note.tieBackward) {
                    vfNotesToTieBackward.push(vfNotes[0]);
                }

                lastBeat = note.off.clone();
            });
            const endOfMeasure = new VF.Fraction(measureLength, 1);
            const endingRestVfNotesAndTuplets = RendererHelpers.getVfNotesForLength(voice.clef, lastBeat, endOfMeasure, true).vfNotesAndTuplets;
            this.handleVfNotesAndTuplets(endingRestVfNotesAndTuplets, vfNotes, allVfTuplets, vfNotesForCurrentTuplet, currentTuplet, true);

            // Build VF ties
            if (vfNotesToTieForward && vfNotesToTieBackward.length) {
                const shortestLength = Math.min(vfNotesToTieForward.length, vfNotesToTieBackward.length);

                for (var i = 0; i < shortestLength; i++) {
                    allVfTies.push(new VF.StaveTie({
                        first_note: vfNotesToTieForward[i],
                        last_note: vfNotesToTieBackward[i],
                        first_indices: [ 0 ],
                        last_indices: [ 0 ],
                    }));
                }
            }

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
        allVfTuplets.forEach(vfTuplet => vfTuplet.setContext(system.getContext()).draw());
        system.getContext().closeGroup('measure');

        rendererMeasure.element = element;
        rendererMeasure.width = width;
    }

    private handleVfNotesAndTuplets(vfNotesAndTuplets: VfNoteAndTuplet[], vfNotes: VF.StaveNote[], vfTuplets: VF.Tuplet[], vfNotesForCurrentTuplet: VF.StaveNote[], currentTuplet: Tuplet, flushAtEnd: boolean = false) {
        let nextCurrentTuplet = currentTuplet;

        function flush() {
            if (nextCurrentTuplet !== null && vfNotesForCurrentTuplet.length) {
                vfTuplets.push(new VF.Tuplet(vfNotesForCurrentTuplet.slice(), {
                    num_notes: nextCurrentTuplet.num_notes, 
                    notes_occupied: nextCurrentTuplet.notes_occupied
                }));
            }

            vfNotesForCurrentTuplet.splice(0, vfNotesForCurrentTuplet.length);
        }

        vfNotesAndTuplets.forEach(({ vfNote, tuplet }) => {
            if (!Tuplet.equal(tuplet, nextCurrentTuplet) && nextCurrentTuplet && vfNotesForCurrentTuplet.length === nextCurrentTuplet.num_notes) {
                flush();
            }

            if (tuplet !== null) {
                vfNotesForCurrentTuplet.push(vfNote);
            }

            nextCurrentTuplet = tuplet;

            vfNotes.push(vfNote);
        });

        if (flushAtEnd) flush();

        return nextCurrentTuplet;
    }
}
