import { Measure } from "./";

export class RendererMeasure {
    public width: number;
    public height: number;

    constructor(
        public measure: Measure,
        public element,
        public x: number,
        public y: number,
        public startsLine: boolean,
    ) { }
}
