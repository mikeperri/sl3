import { Flow as VF } from "vexflow";
import { Measure } from "./";

export class RendererMeasure {
    public element;
    public width: number;
    public height: number;
    public voicesToTieForward: VF.Note[][] = [];

    constructor(
        public measure: Measure,
        public x: number,
        public y: number,
        public startsLine: boolean,
    ) { }
}
