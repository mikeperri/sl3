import { Measure, Voice, FractionalNote } from "./core/models";
import { Flow as VF } from "vexflow";

export const eighthNoteTriplet = [
    new Measure(
        4, 1,
        [
            new Voice('treble', [
                new FractionalNote(new VF.Fraction(0, 1), new VF.Fraction(1, 2)),
                new FractionalNote(new VF.Fraction(1, 1), new VF.Fraction(4, 3)),
                new FractionalNote(new VF.Fraction(4, 3), new VF.Fraction(5, 3)),
                new FractionalNote(new VF.Fraction(5, 3), new VF.Fraction(2, 1)),
                new FractionalNote(new VF.Fraction(2, 1), new VF.Fraction(4, 1)),
            ])
        ]
    ),
    new Measure(
        4, 1,
        [
            new Voice('bass', [
                new FractionalNote(new VF.Fraction(0, 1), new VF.Fraction(1, 2)),
                new FractionalNote(new VF.Fraction(1, 1), new VF.Fraction(4, 3)),
                new FractionalNote(new VF.Fraction(4, 3), new VF.Fraction(5, 3)),
                new FractionalNote(new VF.Fraction(5, 3), new VF.Fraction(2, 1)),
                new FractionalNote(new VF.Fraction(2, 1), new VF.Fraction(4, 1)),
            ])
        ]
    ),
];

export const quarterNoteTriplet = [
    new Measure(
        4, 1,
        [
            new Voice('treble', [
                new FractionalNote(new VF.Fraction(0, 1), new VF.Fraction(1, 2)),
                new FractionalNote(new VF.Fraction(1, 1), new VF.Fraction(5, 3)),
                new FractionalNote(new VF.Fraction(5, 3), new VF.Fraction(7, 3)),
                new FractionalNote(new VF.Fraction(7, 3), new VF.Fraction(3, 1)),
                new FractionalNote(new VF.Fraction(3, 1), new VF.Fraction(4, 1)),
            ])
        ]
    ),
];
