import Brand from "./brand";
import GearType from "./gear_type";
import Ability from "./ability";

export default class Gear {
    constructor(public gearName: string, public brand: Brand, public gearType: GearType, public mainAbility: Ability) {
    }

    abilityNum(ability: Ability): number {
        let abilityNum = 0;
        abilityNum += this.mainAbility.id === ability.id ? 4 : 0;
        abilityNum += this.brand.hasCommonAbility(ability) ? 3 : 0;
        return abilityNum;
    }
}
