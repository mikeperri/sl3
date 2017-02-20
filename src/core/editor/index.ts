import { Flow as VF } from "vexflow";
import { Renderer } from "../renderer";
import { Clef, EditorPosition, KeySignature, Measure, FractionalNote, NoteEvent, RendererMeasure, TimeSignature, Voice } from "../models";

export class Editor {
    private position = new EditorPosition(0, 1, 0);
    private renderer: Renderer;
    private measures: RendererMeasure[] = [];
    private vfFactory: VF.Factory;
    private x: number = 120;
    private y: number = 80;

    constructor(hostElementId) {
        this.renderer = new Renderer(hostElementId);

        this.measures.push(
            new RendererMeasure(
                new Measure(4, 4, [ new Voice('treble'), new Voice('bass') ]),
                this.x,
                this.y,
                true
            )
        );
    }

    public handleBeatNotes(completedEvents, pendingEvents) {
        const completedNotes = completedEvents
                                .map(event => this.noteEventToNote(event, this.position.beatIndex, true));

        const pendingNotes = pendingEvents
                                .map(event => this.noteEventToNote(event, this.position.beatIndex, false))
                                .filter(note => note !== undefined);

        const notes = completedNotes.concat(pendingNotes);

        this.getCurrentVoice().completed.push(...notes);

        // Will depend on how many measures per row
        const shouldAddClef = this.position.measureIndex === 0 && this.position.beatIndex === 0;

        this.renderer.drawMeasure(this.getCurrentRendererMeasure(), this.getPreviousRendererMeasure());
        const nextPosition = this.getNextPosition();

        if (nextPosition.measureIndex === this.position.measureIndex) {
            this.addMeasure();
        }

        this.position = nextPosition;
    }

    // Shouldn't this be handled by rhythm input?
    private noteEventToNote(noteEvent: NoteEvent, beatIndex: number, completed: boolean) {
        const currentBeatCount = this.getCurrentMeasure().beatCount;
        const tieBackward = noteEvent.beatsPending > beatIndex;
        const tieForward = !completed && beatIndex === currentBeatCount - 1;

        if (completed || tieForward) {
            const on = tieBackward ? new VF.Fraction(0, 1) : noteEvent.quantizedOn.asFraction().add(beatIndex - noteEvent.beatsPending, 1);
            const off = tieForward ? new VF.Fraction(currentBeatCount, 1) : noteEvent.quantizedOff.asFraction().add(beatIndex, 1);

            return new FractionalNote(on, off, tieForward, tieBackward);
        }
    }

    private addMeasure() {
        const rendererMeasure = this.getCurrentRendererMeasure();
        const measure = this.getCurrentMeasure();
        const newVoices = measure.voices.map(voice => new Voice(voice.clef));
        this.measures.push(new RendererMeasure(
            new Measure(measure.beatCount, measure.beatValue, newVoices),
            this.x + rendererMeasure.width, // width;
            this.y + 0,
            false
        ));
    }

    private getCurrentRendererMeasure() {
        return this.measures[this.position.measureIndex];
    }

    private getPreviousRendererMeasure() {
        return this.measures[this.position.measureIndex - 1];
    }

    private getCurrentMeasure() {
        return this.getCurrentRendererMeasure().measure;
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
