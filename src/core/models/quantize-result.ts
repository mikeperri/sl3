import { Flow as VF } from "vexflow";

export class QuantizeTimeResult {
    constructor(
        public division: number,
        public divisionCount: number,
        public error: number,
    ) { }

    public asFraction() {
        return new VF.Fraction(this.division, this.divisionCount);
    }
}
