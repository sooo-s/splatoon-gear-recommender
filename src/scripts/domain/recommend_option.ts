import GearCombination from "./gear_combination";
import AbilityOption from "./ability_option";

export default class RecommendOption {
    constructor(
        public requiredAbilities: AbilityOption[],
        public optionalAbilities: AbilityOption[],
        public maxResultSize: number) {
    }
    isRequirementSatisfiedWith(gears: GearCombination): boolean {
        return this.requiredAbilities.every(opt => gears.hasAbility(opt.ability, opt.num))
    }

    getSatisfiedOptionalAbilitiesNum(gears: GearCombination): number {
        return this.optionalAbilities.filter(a => gears.hasAbility(a.ability, a.num)).length;
    }
    isEmpty(): boolean {
        return this.requiredAbilities.concat(this.optionalAbilities).every(a => a.num === 0);
    }
}
