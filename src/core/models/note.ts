import { Flow as VF } from "vexflow";

export class FractionalNote {
    constructor(
        public on: VF.Fraction,
        public off: VF.Fraction,
    ) { }
}
