export class KeySignature {
    constructor(
        public keySpec: string,
    ) { }

    public toVfKeySpec() {
        return this.keySpec;
    }
}
