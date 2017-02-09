import { RhythmInput, Note } from "./index";
import { expect } from "chai";
import { spy } from "sinon";
import _ from "lodash";

describe("completed and pending notes", () => {
    it("should handle pending notes over multiple beats and overlapping notes", () => {
        const callbackSpy = spy();
        const ri = new RhythmInput(
            [ 4, 3 ],
            callbackSpy
        );

        ri.handleBeat(0);
        expect(callbackSpy.callCount).to.equal(0);

        ri.handleNoteOn(25, 123);
        ri.handleNoteOff(75, 123);
        ri.handleNoteOn(78, 123);
        ri.handleNoteOn(78, 124);
        ri.handleBeat(100);
        expect(callbackSpy.firstCall.args[0]).to.deep.equal([
            {
                quantizedOn: {
                    division: 1,
                    divisionCount: 4,
                    error: 0,
                },
                quantizedOff: {
                    division: 3,
                    divisionCount: 4,
                    error: 0,
                },
                beatsPending: 0,
            },
        ]);
        expect(callbackSpy.firstCall.args[1]).to.deep.equal([
            {
                quantizedOn: {
                    division: 3,
                    divisionCount: 4,
                    error: 0.004800000000000004,
                },
                quantizedOff: null,
                beatsPending: 0,
            },
            {
                quantizedOn: {
                    division: 3,
                    divisionCount: 4,
                    error: 0.004800000000000004,
                },
                quantizedOff: null,
                beatsPending: 0,
            },
        ]);

        ri.handleNoteOff(150, 124);
        ri.handleBeat(200);
        expect(callbackSpy.secondCall.args[0]).to.deep.equal([
            {
                quantizedOn: {
                    division: 3,
                    divisionCount: 4,
                    error: 0.004800000000000004,
                },
                quantizedOff: {
                    division: 2,
                    divisionCount: 4,
                    error: 0,
                },
                beatsPending: 1,
            },
        ]);
        expect(callbackSpy.secondCall.args[1]).to.deep.equal([
            {
                quantizedOn: {
                    division: 3,
                    divisionCount: 4,
                    error: 0.004800000000000004,
                },
                quantizedOff: null,
                beatsPending: 1,
            }
        ]);

        ri.handleNoteOff(201, 123);
        ri.handleBeat(300);
        expect(callbackSpy.thirdCall.args[0]).to.deep.equal([
            {
                quantizedOn: {
                    division: 3,
                    divisionCount: 4,
                    error: 0.004800000000000004,
                },
                quantizedOff: {
                    division: 0,
                    divisionCount: 4,
                    error: 0.0016,
                },
                beatsPending: 2,
            }
        ]);
        expect(callbackSpy.thirdCall.args[1]).to.deep.equal([]);
    });
    it("should handle multiple notes inside the same beat", () => {
        const callbackSpy = spy();
        const ri = new RhythmInput(
            [ 4, 3 ],
            callbackSpy
        );

        ri.handleBeat(0);
        ri.handleNoteOn(25, 123);
        ri.handleNoteOff(50, 123);
        ri.handleNoteOn(50, 123);
        ri.handleNoteOff(75, 123);
        ri.handleBeat(100);

        const firstBeatCompletedNotes = callbackSpy.firstCall.args[0];
        expect(firstBeatCompletedNotes.length).to.equal(2);
        expect(firstBeatCompletedNotes[0].quantizedOn.division).to.equal(1);
        expect(firstBeatCompletedNotes[0].quantizedOff.division).to.equal(2);
        expect(firstBeatCompletedNotes[1].quantizedOn.division).to.equal(2);
        expect(firstBeatCompletedNotes[1].quantizedOff.division).to.equal(3);

        const firstBeatPendingNotes = callbackSpy.firstCall.args[1];
        expect(firstBeatPendingNotes.length).to.equal(0);
    });
    it.only("should identify a triplet", () => {
        const callbackSpy = spy();
        const ri = new RhythmInput(
            [ 4, 3 ],
            callbackSpy
        );

        ri.handleBeat(0);
        ri.handleNoteOn(0, 123);
        ri.handleNoteOff(33, 123);
        ri.handleNoteOn(33, 123);
        ri.handleNoteOff(66, 123);
        ri.handleNoteOn(66, 123);
        ri.handleNoteOff(99, 123);
        ri.handleBeat(100);

        const firstBeatCompletedNotes = callbackSpy.firstCall.args[0];
        expect(firstBeatCompletedNotes.length).to.equal(3);

        for (var i = 0; i < 2; i++) {
            expect(firstBeatCompletedNotes[i].quantizedOn.division).to.equal(i);
            expect(firstBeatCompletedNotes[i].quantizedOff.division).to.equal(i + 1);

            expect(firstBeatCompletedNotes[i].quantizedOn.divisionCount).to.equal(3);
            expect(firstBeatCompletedNotes[i].quantizedOff.divisionCount).to.equal(3);
        }

        const firstBeatPendingNotes = callbackSpy.firstCall.args[1];
        expect(firstBeatPendingNotes.length).to.equal(0);
    });
});
