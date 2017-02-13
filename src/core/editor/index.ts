import { Flow as VF } from "vexflow";
import { Renderer } from "../renderer";
import { Clef, EditorPosition, KeySignature, Measure, NoteEvent, TimeSignature, Voice } from "../models";

export class Editor {
    private position = new EditorPosition(0, 0, 0);
    private renderer: Renderer;
    private measures: Measure[] = [];
    private vfFactory: VF.Factory;
    private x: number = 120;
    private y: number = 80;

    constructor(hostElementId) {
        this.renderer = new Renderer();
        this.vfFactory = new VF.Factory({
            renderer: {
                selector: hostElementId,
                width: 800,
                height: 600
            }
        });

        this.measures.push(new Measure(4, 4, [
            new Voice('treble'),
            new Voice('bass'),
        ]));
    }

    public handleBeatNotes(completed, pending) {
        this.getCurrentVoice().completed.push(...completed);
        this.getCurrentVoice().pending = pending;

        // Will depend on how many measures per row
        const shouldAddClef = this.position.measureIndex === 0 && this.position.beatIndex === 0;

        this.renderer.drawMeasure(
            this.vfFactory,
            this.x,
            this.y,
            this.getCurrentMeasure(),
            shouldAddClef
        );
        const nextPosition = this.getNextPosition();

        if (nextPosition.measureIndex === this.position.measureIndex) {
            this.addMeasure();
        }

        this.position = nextPosition;
    }

    private addMeasure() {
        const measure = this.getCurrentMeasure();
        const newVoices = measure.voices.map(voice => new Voice(voice.clef));
        this.measures.push(new Measure(measure.beatCount, measure.beatValue, newVoices));
    }

    private getCurrentMeasure() {
        return this.measures[this.position.measureIndex];
    }

    private getCurrentVoice() {
        return this.getCurrentMeasure().voices[this.position.voiceIndex];
    }

    private getNextPosition() {
        const measure = this.getCurrentMeasure();

        if (this.position.beatIndex + 1 < measure.beatCount) {
            return new EditorPosition(this.position.measureIndex, this.position.voiceIndex, this.position.beatIndex + 1);
        } else {
            return new EditorPosition(this.position.measureIndex + 1, this.position.voiceIndex, 0);
        }
    }
}
