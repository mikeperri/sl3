import { Flow as VF } from "vexflow";
import { Clef, KeySignature, Measure, FractionalNote, RendererMeasure, TimeSignature } from "../models";
import { FractionalNotesToStaveNotes } from "../fractional-notes-to-stave-notes";

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
        //noteToTie: VF.StaveNote
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
        const clefsAndVfVoices = measure.voices.map(voice => {
            const vfVoice = new VF.Voice({ num_beats: 4, beat_value: 4 });
            const { vfNotes, vfTies } = FractionalNotesToStaveNotes.mapNotes(voice.clef, voice.completed)
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

}
