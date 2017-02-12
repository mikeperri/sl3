export class TimeSignature {
    constructor(
        public numerator: number,
        public denominator: number,
    ) { }

    public toVfTimeSpec() {
        return `${this.numerator}/${this.denominator}`;
    }
}
