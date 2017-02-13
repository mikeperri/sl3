import { Clef, NoteEvent } from "./";

export class Voice {
    constructor(
        public clef: Clef,
        public completed: NoteEvent[] = [],
        public pending: NoteEvent[] = [],
    ) { }
}
