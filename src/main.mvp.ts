import { render } from "./core/renderer";
import { KeyboardRhythmInputHandle } from "./core/keyboard-rhythm-input";
import { RhythmInput } from "./core/rhythm-input";

render("renderer-host");
const divisionCounts = [4, 3];
var kriHandle = new KeyboardRhythmInputHandle(
    document,
    divisionCounts,
    handleBeat,
    handleNoteOn,
    handleNoteOff,
);
var ri = new RhythmInput(
    divisionCounts,
    handleNotesReady,
);

function handleBeat() {
    console.log("beat");
    const time = Date.now();
    ri.handleBeat(time);
}

function handleNoteOn(id: number) {
    const time = Date.now();
    console.log("on: " + id);
    ri.handleNoteOn(time, id);
}

function handleNoteOff(id: number) {
    const time = Date.now();
    console.log("off: " + id);
    ri.handleNoteOff(time, id);
}

function handleNotesReady(completed, pending) {
    console.log("completed:", completed);
    console.log("pending:", pending);
}
