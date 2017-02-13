import { quantizeTime } from "../quantize/index";
import { NoteEvent, QuantizeTimeResult } from "../models";

class NotePress {
    public offTime: number = null; // Set when the note goes off
    public beatsPending: number = 0; // Incremented whenever a beat ends and the note has not gone off
    public quantizedOn: QuantizeTimeResult; // Set when the note's original beat ends

    constructor(
        public id: number,
        public onTime: number,
    ) { }
}

export class RhythmInput {
    private beatStartTime: number = null;
    private notePresses: NotePress[] = [];

    constructor(
        public divisionCounts: number[],
        public handleNotesReady: (completedNotes: NoteEvent[], pendingNotes: NoteEvent[]) => void,
    ) { }

    public handleBeat(time: number) {
        if (this.beatStartTime !== null) {
            this.flush(time);
        }

        this.beatStartTime = time;
    }

    // Taking id allows multiple notes to be on at once
    public handleNoteOn(onTime: number, id: number) {
        const notePress = new NotePress(id, onTime);

        this.notePresses.push(notePress);
    }

    public handleNoteOff(offTime: number, id: number) {
        const notePress = this.notePresses.filter(notePress => {
            return notePress.offTime === null && notePress.id === id;
        })[0];

        if (notePress) {
            notePress.offTime = offTime;
        } // may want to add else case to handle notes before recording started
    }

    private quantizeNewTimes(notePress: NotePress, divisionCount: number, beatLength: number): { error: number, note: NoteEvent } {
        let error = 0;
        let quantizedOn = notePress.quantizedOn;
        let quantizedOff;

        if (notePress.beatsPending === 0) {
            quantizedOn = quantizeTime(notePress.onTime - this.beatStartTime, divisionCount, beatLength);
            error += quantizedOn.error;
        }

        if (notePress.offTime) {
            quantizedOff = quantizeTime(notePress.offTime - this.beatStartTime, divisionCount, beatLength);
            error += quantizedOff.error;

            return {
                error,
                note: new NoteEvent(
                    quantizedOn,
                    quantizedOff,
                    notePress.beatsPending,
                ),
            };
        } else {
            return {
                error,
                note: new NoteEvent(
                    quantizedOn,
                    null,
                    notePress.beatsPending,
                )
            }
        }
    }

    private fixZeroLengthNote(note: NoteEvent) {
        if (note.beatsPending === 0 && note.quantizedOn.division === note.quantizedOff.division) {
            const division = note.quantizedOn.division;
            const divisionCount = note.quantizedOn.divisionCount;
            const onIsFurther = Math.abs(note.quantizedOn.error) > Math.abs(note.quantizedOff.error);
            const adjustOn = (onIsFurther && division > 0) || (!onIsFurther && division > divisionCount);

            if (adjustOn) {
                note.quantizedOn.division--;
            } else {
                note.quantizedOff.division++;
            }
        }
    }

    private flush(time: number) {
        const beatLength = time - this.beatStartTime;

        const resultsByDivisionCount = this.divisionCounts.map(divisionCount => {
            const results = this.notePresses.map(notePress => {
                return this.quantizeNewTimes(notePress, divisionCount, beatLength);
            });
            let totalError = 0;
            results.forEach(result => { totalError += result.error });
            totalError = Math.abs(totalError);

            return {
                divisionCount,
                results: results.map(result => result.note),
                totalError,
            }
        });

        // Find division count with minimum error
        let bestResults: NoteEvent[] = null;
        let bestTotalError: number;
        resultsByDivisionCount.forEach(({ divisionCount, results, totalError }) => {
            if (divisionCount % 2 !== 0) {
                totalError *= 2;
            }

            if (bestResults === null || totalError < bestTotalError) {
                bestResults = results;
                bestTotalError = totalError;
            }
        });

        const nextNotePresses: NotePress[] = [];
        this.notePresses.forEach((notePress, i) => {
            if (notePress.offTime === null) {
                notePress.quantizedOn = bestResults[i].quantizedOn;
                notePress.beatsPending++;
                nextNotePresses.push(notePress);
            }
        });
        this.notePresses = nextNotePresses;

        bestResults.forEach(note => this.fixZeroLengthNote(note));
        const completedNotes = bestResults.filter(result => result.quantizedOff);
        const pendingNotes = bestResults.filter(result => !result.quantizedOff);

        this.handleNotesReady(completedNotes, pendingNotes);
    }
}
