export class Tuplet {
    constructor(
        public num_notes: number,
        public notes_occupied: number,
    ) { }

    public static equal(t1: Tuplet, t2: Tuplet) {
        if (t1 === null && t2 === null) {
            return true;
        } else if (t1 === null || t2 === null) {
            return false;
        } else {
            return t1.num_notes === t2.num_notes && t1.notes_occupied === t2.notes_occupied;
        }
    }
}

export const Tuplets = {
    Triplet: new Tuplet(3, 1),
}
