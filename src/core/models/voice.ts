import { Clef, Note } from "./";

export class Voice {
    constructor(
        public clef: Clef,
        public completed: Note[] = [],
        public pending: Note[] = [],
    ) { }
}
