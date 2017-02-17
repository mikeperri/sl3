import { Measure } from "./";

export class RendererMeasure {
    public element;
    public width: number;
    public height: number;

    constructor(
        public measure: Measure,
        public x: number,
        public y: number,
        public startsLine: boolean,
    ) { }
}
