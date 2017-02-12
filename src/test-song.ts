import { Note } from "./core/rhythm-input";
import { QuantizeTimeResult } from "./core/quantize";

export const a = [
    new Note(
        new QuantizeTimeResult(0, 4, 0),
        new QuantizeTimeResult(2, 4, 0),
        0
    ),
    new Note(
        new QuantizeTimeResult(3, 4, 0),
        new QuantizeTimeResult(4, 4, 0),
        0
    ),
];

export const b = [
    new Note(
        new QuantizeTimeResult(0, 4, 0),
        new QuantizeTimeResult(2, 4, 0),
        0
    ),
    new Note(
        new QuantizeTimeResult(2, 4, 0),
        new QuantizeTimeResult(4, 4, 0),
        0
    ),
];
