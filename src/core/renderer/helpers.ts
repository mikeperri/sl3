import { Flow as VF } from "vexflow";
import { Clef, FractionalNote, Tuplet, Tuplets } from "../models";

export interface VfNoteAndTuplet {
    vfNote: VF.StaveNote[],
    tuplet: Tuplet;
}

interface DurationsAndTuplet {
    durations: string[];
    tuplet: Tuplet;
}

export class RendererHelpers {
    public static getVfNotesForLength(clef: Clef, start: VF.Fraction, end: VF.Fraction, rest = false, keys = null): { vfNotesAndTuplets: VfNoteAndTuplet[], vfTies: VF.StaveTie[] } {
        const length = end.clone().subtract(start);

        if (length.lessThanEquals(0, 1)) {
            return { vfNotesAndTuplets: [], vfTies: [] };
        }

        if (!keys) {
            keys = clef === "treble" ? ["b/4"] : ["d/3"];
        }

        // Need to break up notes appropriately
        // http://music.indiana.edu/departments/academic/composition/style-guide/index.shtml#rhythm
        start.simplify();
        end.simplify();

        // Find boundaries for division
        const divisionPoints = this.getDivisionPoints(start, end);
        let durationsAndTuplets = this.divisionPointsToDurationsAndTuplets(start, end, divisionPoints);

        if (rest) {
            durationsAndTuplets.forEach(durationsAndTuplet => {
                durationsAndTuplet.durations = durationsAndTuplet.durations.map(d => d + "r");
            });
        }

        const vfNotesAndTuplets: VfNoteAndTuplet[] = [];
        durationsAndTuplets.forEach(({ durations, tuplet }) => {
            durations.forEach(duration => {
                const vfNote = new VF.StaveNote({ clef, keys, duration });
                if (vfNote.dots > 0) {
                    vfNote.addDotToAll();
                }
                vfNotesAndTuplets.push({ vfNote, tuplet });
            });
        });

        // Add ties
        const vfTies: VF.StaveTie[] = [];
        if (!rest) {
            for (var i = 1; i < vfNotesAndTuplets.length; i++) {
                vfTies.push(new VF.StaveTie({
                    first_note: vfNotesAndTuplets[i - 1].vfNote,
                    last_note: vfNotesAndTuplets[i].vfNote,
                    first_indices: [ 0 ],
                    last_indices: [ 0 ],
                }));
            }
        }

        return { vfNotesAndTuplets, vfTies };
    }

    // start and end must be simplified
    private static getDivisionPoints(start: VF.Fraction, end: VF.Fraction) {
        let points: VF.Fraction[] = [];
        if (this.fractionToTuplet(end)) {
            // don't make any divisions within a tuplet!
        } else if (start.denominator >= 3 && start.denominator > end.denominator) {
            const factor = this.getDivisionFactor(start.denominator);
            const point = new VF.Fraction(Math.ceil(start.numerator / factor), start.denominator / factor)
            while(point.lessThan(end)) {
                points.push(point.clone());
                point.add(1, point.denominator);
            }
        } else if (end.denominator >= 3) {
            const factor = this.getDivisionFactor(end.denominator);
            const point = new VF.Fraction(Math.floor(end.numerator / factor), end.denominator / factor);
            while(point.greaterThan(start)) {
                points.push(point.clone());
                point.subtract(1, point.denominator);
            }
            points.reverse();
        }
        return points;
    }

    private static getDivisionFactor(n: number): number {
        while (n % 2 === 0) {
            n /= 2;
        }
        return n === 1 ? 4 : n;
    }

    private static divisionPointsToDurationsAndTuplets(start: VF.Fraction, end: VF.Fraction, divisionPoints: VF.Fraction[]): DurationsAndTuplet[] {
        let pointsInRange: VF.Fraction[] = [ start ];
        divisionPoints.forEach(divisionPoint => {
            if (divisionPoint.greaterThan(start) && divisionPoint.lessThan(end)) {
                pointsInRange.push(divisionPoint);
            }
        });
        pointsInRange.push(end);

        let durationsAndTuplets = [];
        for (var i = 1; i < pointsInRange.length; i++) {
            const length = pointsInRange[i].clone().subtract(pointsInRange[i - 1]);
            durationsAndTuplets.push(this.lengthToVfDurationsAndTuplet(length));
        }

        return durationsAndTuplets;
    }

    private static fractionToTuplet(f: VF.Fraction) {
        if (f.denominator % 3 === 0) {
            return Tuplets.Triplet;
        } else {
            return null;
        }
    }

    private static lengthToVfDurationsAndTuplet(length: VF.Fraction): DurationsAndTuplet {
        const tuplet = this.fractionToTuplet(length);

        if (length.equals(new VF.Fraction(1, 4))) {
            return { durations: ['16'], tuplet };
        } else if (length.equals(new VF.Fraction(1, 2))) {
            return { durations: ['8'], tuplet };
        } else if (length.equals(new VF.Fraction(3, 4))) {
            return { durations: ['8d'], tuplet };
        } else if (length.equals(new VF.Fraction(1, 1))) {
            return { durations: ['4'], tuplet };
        } else if (length.equals(new VF.Fraction(2, 1))) {
            return { durations: ['2'], tuplet };
        } else if (length.equals(new VF.Fraction(3, 1))) {
            return { durations: ['2d'], tuplet };
        } else if (length.equals(new VF.Fraction(4, 1))) {
            return { durations: ['1'], tuplet };
        } else if (length.equals(new VF.Fraction(5, 4))) {
            return { durations: ['4', '16'], tuplet };
        } else if (length.equals(new VF.Fraction(3, 2))) {
            return { durations: ['4d'], tuplet };
        } else if (length.equals(new VF.Fraction(5, 2))) {
            return { durations: ['4', '4', '8'], tuplet };
        } else if (length.equals(new VF.Fraction(7, 2))) {
            return { durations: ['4', '4', '4', '8'], tuplet };
        } else if (length.equals(new VF.Fraction(1, 3))) {
            return { durations: ['8'], tuplet };
        } else if (length.equals(new VF.Fraction(2, 3))) {
            return { durations: ['4'], tuplet };
        } else {
            throw new Error("Not implemented yet: quarterNoteCount = " + length);
        }
    }
};
