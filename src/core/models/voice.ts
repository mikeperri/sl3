import { Clef, FractionalNote } from "./";

export class Voice {
    constructor(
        public clef: Clef,
        public completed: FractionalNote[] = [],
        public pending: FractionalNote[] = [],
    ) { }
}
