import { QuantizeTimeResult } from "../models";

export class Tap {
    constructor(
        public on: number,
        public off: number,
    ) { }
}

export function quantizeTime(time: number, divisionCount: number, beatLength: number) {
    const divisionLength = beatLength / divisionCount;
    const unroundedDivision = time / divisionLength;
    const division = Math.round(unroundedDivision);
    const error = (unroundedDivision - division) / divisionLength;

    return new QuantizeTimeResult(division, divisionCount, error);
}
