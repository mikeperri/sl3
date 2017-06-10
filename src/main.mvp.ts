import { Editor } from "./core/editor";
import { KeyboardRhythmInputHandle } from "./core/keyboard-rhythm-input";
import { RhythmInput } from "./core/rhythm-input";
import { RhythmInputDisplay } from "./core/rhythm-input/display";
import { TimeSignature, KeySignature } from "./core/models";

// TESTING
import * as testInput from "./test-input";
import * as testSongs from "./test-songs";

const editor = new Editor("renderer-host");
const divisionCounts = [4, 3];
var kriHandle = new KeyboardRhythmInputHandle(
    document,
    divisionCounts,
    handleBeat,
    handleNoteOn,
    handleNoteOff,
    handleStart,
    handleStop,
);
var ri = new RhythmInput(
    divisionCounts,
    handleNotesReady,
);
var rid = new RhythmInputDisplay("rhythm-input-display");

function handleBeat() {
    console.log("beat");
    const time = Date.now();
    ri.handleBeat(time);
    rid.handleBeat(time);
}

function handleNoteOn(id: number) {
    const time = Date.now();
    console.log("on: " + id);
    ri.handleNoteOn(time, id);
    rid.handleNoteOn(time, id);
}

function handleNoteOff(id: number) {
    const time = Date.now();
    console.log("off: " + id);
    ri.handleNoteOff(time, id);
    rid.handleNoteOff(time, id);
}

function handleStart() {
    rid.start();
}

function handleStop() {
    rid.stop();
}

function handleNotesReady(completed, pending) {
    console.log("completed:", completed);
    console.log("pending:", pending);

    editor.handleBeatNotes(completed, pending);
    rid.handleNotesReady(completed, pending);
}

function init() {
    // TEST
    editor.renderMeasures(testSongs.eighthNoteTriplet);
}

init();
