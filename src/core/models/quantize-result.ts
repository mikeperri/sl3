import { Fraction } from "../util/fraction";

export class QuantizeTimeResult {
    constructor(
        public division: number,
        public divisionCount: number,
        public error: number,
    ) { }

    public asFraction() {
        return new Fraction(this.division, this.divisionCount);
    }
}
