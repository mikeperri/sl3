export class Tap {
    constructor(
        public on: number,
        public off: number,
    ) { }
}

export class QuantizeTimeResult {
    constructor(
        public division: number,
        public divisionCount: number,
        public error: number,
    ) { }
}

export class QuantizeBeatResult {
    constructor(
        public quantizedOn: QuantizeTimeResult,
        public quantizedOff: QuantizeTimeResult,
    ) { }
}

export function quantizeTime(time: number, divisionCount: number, beatLength: number) {
    const divisionLength = beatLength / divisionCount;
    const unroundedDivision = time / divisionLength;
    const division = Math.round(unroundedDivision);
    const error = (unroundedDivision - division) / divisionLength;

    return new QuantizeTimeResult(division, divisionCount, error);
}
