import { QuantizeTimeResult } from "./quantize-result";

export class NoteEvent {
    constructor(
        public quantizedOn: QuantizeTimeResult,
        public quantizedOff: QuantizeTimeResult,
        public beatsPending: number,
    ) { }
}
