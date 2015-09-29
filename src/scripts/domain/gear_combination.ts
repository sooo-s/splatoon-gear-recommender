import Gear from "./gear";
import Ability from "./ability";

export default class GearCombination {
    private gears: Gear[] = [];

    constructor(public headGear: Gear, public clothing: Gear, public shoe: Gear) {
        this.gears = [headGear, clothing, shoe];
    }

    hasAbility(ability: Ability, num: number): boolean {
        return this.gears.reduce((acc, gear) => acc + gear.abilityNum(ability), 0) >= num;
    }
}
