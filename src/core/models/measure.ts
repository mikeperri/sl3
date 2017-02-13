import { Voice } from "./";

export class Measure {
    constructor(
        public beatCount,
        public beatValue,
        public voices: Voice[] = [],
        public keySigChange = null,
        public timeSigChange = null,
    ) { }
}
