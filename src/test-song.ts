import { NoteEvent, QuantizeTimeResult } from "./core/models";

export const thirtySecondNotes = [
    {
        completed: [
            new NoteEvent(
                new QuantizeTimeResult(0, 4, 0),
                new QuantizeTimeResult(2, 4, 0),
                0
            ),
        ],
        pending: []
    },
    {
        completed: [],
        pending: [
            new NoteEvent(
                new QuantizeTimeResult(3, 4, 0),
                null,
                0
            ),
        ]
    },
    {
        completed: [],
        pending: [
            new NoteEvent(
                new QuantizeTimeResult(3, 4, 0),
                null,
                1
            ),
        ]
    },
    {
        completed: [
            new NoteEvent(
                new QuantizeTimeResult(3, 4, 0),
                new QuantizeTimeResult(3, 4, 0),
                2
            ),
        ],
        pending: []
    },
    {
        completed: [
            new NoteEvent(
                new QuantizeTimeResult(0, 4, 0),
                new QuantizeTimeResult(4, 4, 0),
                0
            ),
        ],
        pending: []
    },
];

export const multiMeasureNote = [
    {
        completed: [
            new NoteEvent(
                new QuantizeTimeResult(0, 4, 0),
                new QuantizeTimeResult(4, 4, 0),
                0
            ),
        ],
        pending: []
    },
    {
        completed: [],
        pending: [
            new NoteEvent(
                new QuantizeTimeResult(0, 4, 0),
                null,
                0
            ),
        ],
    },
    {
        completed: [
            new NoteEvent(
                new QuantizeTimeResult(0, 4, 0),
                new QuantizeTimeResult(4, 4, 0),
                1
            ),
        ],
        pending: [],
    },
    {
        completed: [],
        pending: [
            new NoteEvent(
                new QuantizeTimeResult(0, 4, 0),
                null,
                0
            ),
        ],
    },
    {
        completed: [
        ],
        pending: [
            new NoteEvent(
                new QuantizeTimeResult(0, 4, 0),
                new QuantizeTimeResult(4, 4, 0),
                1
            ),
        ],
    },
    {
        completed: [
        ],
        pending: [
            new NoteEvent(
                new QuantizeTimeResult(0, 4, 0),
                new QuantizeTimeResult(4, 4, 0),
                2
            ),
        ],
    },
    {
        completed: [
        ],
        pending: [
            new NoteEvent(
                new QuantizeTimeResult(0, 4, 0),
                new QuantizeTimeResult(4, 4, 0),
                3
            ),
        ],
    },
    {
        completed: [
        ],
        pending: [
            new NoteEvent(
                new QuantizeTimeResult(0, 4, 0),
                new QuantizeTimeResult(4, 4, 0),
                4
            ),
        ],
    },
    {
        completed: [
            new NoteEvent(
                new QuantizeTimeResult(0, 4, 0),
                new QuantizeTimeResult(4, 4, 0),
                5
            ),
        ],
        pending: [
        ],
    },
];
