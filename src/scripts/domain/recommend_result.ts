import Gear from "./gear";
import GearCombination from "./gear_combination";

export default class RecommendResult {
    headGear: Gear;
    clothing: Gear;
    shoe: Gear;
    score: number;

    constructor(combination: GearCombination, score: number) {
        this.headGear = combination.headGear;
        this.clothing = combination.clothing;
        this.shoe = combination.shoe;
        this.score = score;
    }
}
