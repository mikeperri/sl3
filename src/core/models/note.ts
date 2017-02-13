import { Flow as VF } from "vexflow";

export class Note {
    constructor(
        public on: VF.Fraction,
        public off: VF.Fraction,
    ) { }
}
