import { NoteEvent } from '../models';

const canvasWidth = 800;
const canvasHeight = 200;
const beatWidth = 50;

type RhythmInputEventType = 'BEAT' | 'TAP' | 'QUANTIZED_COMPLETED' | 'QUANTIZED_PENDING';

interface RhythmInputEvent {
    type: RhythmInputEventType;
    element?: HTMLElement;
    onTime?: number;
    offTime?: number;
    onDecimal?: number;
    offDecimal?: number;
    id?: number;
}

interface MarkerOptions {
    color: string;
    y1: number;
    height: number;
}

const markerOptionsMap: { [key: string]: MarkerOptions } = {
    BEAT: {
        color: 'black',
        y1: 0,
        height: 20,
    },
    TAP: {
        color: 'blue',
        y1: 20,
        height: canvasHeight - 20,
    },
    QUANTIZED_PENDING: {
        color: 'yellow',
        y1: 20,
        height: canvasHeight - 20,
    },
    QUANTIZED_COMPLETED: {
        color: 'pink',
        y1: 20,
        height: canvasHeight - 20,
    },
}

export class RhythmInputDisplay {
    private beatEvents: RhythmInputEvent[] = [];
    private tapEvents: RhythmInputEvent[] = [];
    private quantizedEvents: RhythmInputEvent[] = [];
    private started = false;

    private activeEvents: { [key: number]: RhythmInputEvent } = {};
    private hostElement: HTMLElement;

    constructor(
        hostElementId: string,
    ) {
        this.hostElement = document.getElementById(hostElementId);

        this.start();
    }

    public handleBeat(time: number) {
        this.beatEvents.push({
            type: 'BEAT',
            onTime: time,
            element: this.createBeatElement(),
        });
    }

    public handleNoteOn(time: number, id: number) {
        const e: RhythmInputEvent = {
            type: 'TAP',
            onTime: time,
            id,
            element: this.createNoteElement(),
        };
        this.tapEvents.push(e);
        this.activeEvents[id] = e;
    }

    public handleNoteOff(time: number, id: number) {
        const activeEvent = this.activeEvents[id];

        if (!activeEvent) return;
        activeEvent.offTime = time;
        delete this.activeEvents[id];
    }

    public handleNotesReady(completedNotes: NoteEvent[], pendingNotes: NoteEvent[]) {

        completedNotes.forEach(note => {
            this.quantizedEvents.push({
                type: 'QUANTIZED_COMPLETED',
                onDecimal: (note.quantizedOn.division / note.quantizedOn.divisionCount) - note.beatsPending,
                offDecimal: (note.quantizedOff.division / note.quantizedOff.divisionCount),
            });
        });
    }

    public start() {
        this.started = true;

        const cb = () => {
            this.draw();

            if (this.started) {
                setTimeout(() => window.requestAnimationFrame(cb), 50);
            }
        }

        window.requestAnimationFrame(cb);
    }

    public stop() {
        this.started = false;
    }

    private createBeatElement() {
        const el = document.createElement('div');
        el.className = 'beat';
        return el;
    }

    private createNoteElement() {
        const el = document.createElement('div');
        el.className = 'note';
        return el;
    }

    private draw() {
        const time = Date.now();
        const beatEvents = this.beatEvents.concat([ { type: 'BEAT', onTime: time } ]);

        const beatIndex = Math.max(beatEvents.length - 1, 0);

        const startBeatTime = beatEvents[beatIndex - 1].onTime;
        const endBeatTime = beatEvents[beatIndex].onTime;
        const beatLength = endBeatTime - startBeatTime;

        this.context.fillRect(beatWidth * beatIndex, 0, 2, canvasHeight);
        this.drawMarker('BEAT', beatIndex, 0);

        this.tapEvents.forEach(e => {
            if (e.onTime >= startBeatTime && e.onTime < endBeatTime) {
                e.onDecimal = (e.onTime - startBeatTime) / beatLength;

                if (e.offTime === undefined || e.offTime >= endBeatTime) {
                    e.offDecimal = 1;
                } else {
                    e.offDecimal = (e.offTime - startBeatTime) / beatLength;
                }

                this.drawMarker('TAP', beatIndex - 1, e.onDecimal, e.offDecimal);
            } else if (e.onTime < startBeatTime && (e.offTime >= endBeatTime || e.offTime === undefined)) {
                this.drawMarker('TAP', beatIndex - 1, 0, 1);
            } else if (e.offTime >= startBeatTime && e.offTime <= endBeatTime) {
                e.offDecimal = (e.offTime - startBeatTime) / beatLength;

                this.drawMarker('TAP', beatIndex - 1, 0, e.offDecimal);
            }
        });

        const offTaps = this.tapEvents.filter(e => {
            return e.offTime >= startBeatTime && e.offTime <= endBeatTime;
        });
        offTaps.forEach(e => {
            e.offDecimal = e.offTime / beatLength;
        });
    }

    private drawMarker(type: RhythmInputEventType, beatIndex: number, onDecimal: number, offDecimal?: number) {
        let { color, y1, height }  = markerOptionsMap[type];

        const x1 = (beatWidth * beatIndex) + (beatWidth * onDecimal);
        const width = offDecimal ? ((beatWidth * beatIndex) + (beatWidth * offDecimal) - x1) : 1;

        this.context.fillStyle = color;
        // console.log('drawing', type, 'from', y1, 'to', (y1 + height), 'in', color);
        this.context.fillRect(x1, y1, width, height);
    }
}
