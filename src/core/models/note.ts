import { QuantizeTimeResult } from "./quantize-result";

export class Note {
    constructor(
        public quantizedOn: QuantizeTimeResult,
        public quantizedOff: QuantizeTimeResult,
        public beatsPending: number,
    ) { }
}
