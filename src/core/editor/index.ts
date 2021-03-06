import { Flow as VF } from "vexflow";
import { Renderer } from "../renderer";
import { Clef, EditorPosition, KeySignature, Measure, FractionalNote, NoteEvent, RendererMeasure, TimeSignature, Voice } from "../models";

const initX = 10;
const initY = 20;

export class Editor {
    private position = new EditorPosition(0, 1, 0);
    private renderer: Renderer;
    private measures: RendererMeasure[] = [];
    private vfFactory: VF.Factory;

    constructor(hostElementId) {
        this.renderer = new Renderer(hostElementId);

        this.addMeasure();
    }

    public renderMeasures(measures: Measure[]) {
        if (this.position.beatIndex !== 0) {
            this.addMeasure();
            this.position.measureIndex++;
            this.position.beatIndex = 0;
        }

        measures.forEach((measure, measureIndex) => {
            if (!this.measures[measureIndex]) {
                this.addMeasure();
            }
            this.position.measureIndex = measureIndex;

            measure.voices.forEach(voice => {
                const voiceIndex = this.getCurrentMeasure().voices
                                                .findIndex(rendererVoice => rendererVoice.clef === voice.clef);
                if (voiceIndex !== -1) {
                    this.position.voiceIndex = voiceIndex;
                    this.renderNotes(voice.completed);
                }
            });
        });

        this.addMeasure();
        this.position.measureIndex++;
        this.renderNotes([]);
    }

    public handleBeatNotes(completedEvents: NoteEvent[], pendingEvents: NoteEvent[]) {
        console.log('handling beat notes @ position', this.position.measureIndex, this.position.beatIndex);
        const completedNotes = completedEvents
                                .map(event => this.noteEventToNote(event, this.position.beatIndex, true));

        const pendingNotes = pendingEvents
                                .map(event => this.noteEventToNote(event, this.position.beatIndex, false))
                                .filter(note => note !== undefined); // pending notes that don't end at end of measure are removed

        const notes = completedNotes.concat(pendingNotes);

        this.renderNotes(notes);

        const nextPosition = this.getNextPosition();

        if (nextPosition.measureIndex > this.position.measureIndex) {
            this.addMeasure();
        }

        this.position = nextPosition;
    }

    private renderNotes(completedNotes: FractionalNote[], pendingNotes?: FractionalNote[]) {
        this.getCurrentVoice().completed.push(...completedNotes);
        this.getCurrentVoice().pending.push(...pendingNotes);

        this.renderer.drawMeasure(this.getCurrentRendererMeasure(), this.getPreviousRendererMeasure());
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

    private getDefaultMeasure() {
        return new RendererMeasure(
            new Measure(4, 4, [ new Voice('treble'), new Voice('bass') ]),
            initX,
            initY,
            true
        );
    }

    private addMeasure() {
        if (this.measures.length === 0) {
            this.measures.push(this.getDefaultMeasure());
            return;
        }

        const rendererMeasure = this.getCurrentRendererMeasure();
        const measure = this.getCurrentMeasure();
        const newVoices = measure.voices.map(voice => new Voice(voice.clef));
        this.measures.push(new RendererMeasure(
            new Measure(measure.beatCount, measure.beatValue, newVoices),
            rendererMeasure.x + rendererMeasure.width,
            initY,
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
