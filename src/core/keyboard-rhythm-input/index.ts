export class KeyboardRhythmInputHandle {
    private beatStartTime: number;
    private noteTimes = [];
    private keysDown = [];

    constructor(
        private __document__: any,
        private divisionCounts: number[],
        private handleBeat: () => void,
        private handleNoteOn: (number) => void,
        private handleNoteOff: (number) => void,
        private start: () => void,
        private stop: () => void,
    ) {
        this.subscribe();
    }

    public subscribe() {
        this.__document__.addEventListener('keydown', this.keyDownListener.bind(this));
        this.__document__.addEventListener('keyup', this.keyUpListener.bind(this));
    }

    private keyDownListener(e: KeyboardEvent) {
        const code = e.keyCode;

        if (this.keysDown.indexOf(code) !== -1) {
            return;
        }
        e.preventDefault();

        this.keysDown.push(code);

        if (code === 32) {
            this.handleBeat();
        } else if (code >= 65 && code <= 90) {
            this.handleNoteOn(code);
        } else if (code === 13) {
            this.start();
        } else if (code === 27) {
            this.stop();
        }
    }

    private keyUpListener(e: KeyboardEvent) {
        const code = e.keyCode;

        this.keysDown = this.keysDown.filter(c => c !== code);

        if (code >= 65 && code <= 90) {
            this.handleNoteOff(code);
        }
    }
}
