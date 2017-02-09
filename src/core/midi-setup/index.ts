export class MIDINote {
    constructor(
        public note: number,
        public velocity: number,
    ) { }
}

export class MIDIAccessHandle {
    private midiAccess;

    constructor(
        public __navigator__: any,
        public handleNoteOn: (note: MIDINote) => void,
        public handleNoteOff: (note: MIDINote) => void,
        public handleNotSupported: () => void,
    ) {
        if (!__navigator__.requestMIDIAccess) {
            handleNotSupported();
        } else {
            __navigator__.requestMIDIAccess().then((midiAccess) => {
                this.midiAccess = midiAccess;
                this.subscribe();
            }, handleNotSupported);
        }
    }

    public subscribe() {
        const boundOnMessage = this.onMessage.bind(null, this.handleNoteOn, this.handleNoteOff);
        const inputValues = this.midiAccess.input.values();

        inputValues.forEach(input => {
            input.value.onmidimessage = boundOnMessage;
        });
    }

    public unsubscribe() {
        const inputValues = this.midiAccess.input.values();

        inputValues.forEach(input => {
            delete input.value.onmidimessage;
        });
    }

    private onMessage(handleNoteOn, handleNoteOff, message) {
        const messageType = message.data[0] & 0xf0;
        const note = message.data[1];
        const velocity = message.data[2];

        if (messageType === 144) {
            handleNoteOn(note, velocity);
        } else if (messageType === 128) {
            handleNoteOff(note, velocity);
        }
    }
}
