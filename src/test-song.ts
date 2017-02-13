import { NoteEvent, QuantizeTimeResult } from "./core/models";

export const a = [
    new NoteEvent(
        new QuantizeTimeResult(0, 4, 0),
        new QuantizeTimeResult(2, 4, 0),
        0
    ),
    new NoteEvent(
        new QuantizeTimeResult(3, 4, 0),
        new QuantizeTimeResult(4, 4, 0),
        0
    ),
];

export const b = [
    new NoteEvent(
        new QuantizeTimeResult(0, 4, 0),
        new QuantizeTimeResult(2, 4, 0),
        0
    ),
    new NoteEvent(
        new QuantizeTimeResult(2, 4, 0),
        new QuantizeTimeResult(4, 4, 0),
        0
    ),
];
