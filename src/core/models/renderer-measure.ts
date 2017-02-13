import { Measure } from "./";

export class RendererMeasure {
    constructor(
        public measure: Measure,
        public element,
        public x: number,
        public y: number,
        public startsLine: boolean,
    ) { }
}
