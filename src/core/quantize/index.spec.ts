import { Tap, quantizeTime } from './index';
import { expect } from "chai";

describe('Quantize beat', () => {
    it('should quantize four sixteenth notes at the exact times', () => {
        const taps: Tap[] = [
            new Tap(0, 25),
            new Tap(25, 50),
            new Tap(50, 75),
            new Tap(75, 100),
        ];
        const divisionCount = 4;
        const beatLength = 100;

        const result1 = quantizeTime(0, divisionCount, beatLength);
        expect(result1.division).to.equal(0);
        expect(result1.divisionCount).to.equal(4);
        expect(result1.error).to.equal(0);

        const result2 = quantizeTime(25, divisionCount, beatLength);
        expect(result2.division).to.equal(1);
        expect(result2.divisionCount).to.equal(4);
        expect(result2.error).to.equal(0);

        const result3 = quantizeTime(51, divisionCount, beatLength);
        expect(result3.division).to.equal(2);
        expect(result3.error).to.be.above(0);

        const result4 = quantizeTime(74, divisionCount, beatLength);
        expect(result4.division).to.equal(3);
        expect(result4.error).to.be.below(0);

    });
});
