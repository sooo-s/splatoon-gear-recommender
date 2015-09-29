import Gear from "./gear";
import GearType from "./gear_type";
import Brand from "./brand";
import Ability from "./ability";
import RecommendOption from "./recommend_option";
import GearCombination from "./gear_combination";
import GearCombinationsCreator from "./gear_combinations_creator";
import RecommendResult from "./recommend_result";

export default class GearRecommender {
    constructor(private gearCombinations: GearCombination[]) {
    }

    recommend(recommendOption: RecommendOption): RecommendResult[] {
        let result = this.gearCombinations
            .map(gears => {
                let value = 0;
                if (!recommendOption.isRequirementSatisfiedWith(gears)) {
                    value = 0;
                } else {
                    value = recommendOption.getSatisfiedOptionalAbilitiesNum(gears);
                }
                return { gears, value };
            })
            .filter(result => result.value > 0)
            .map(result => new RecommendResult(result.gears, result.value))
            .sort((a, b) => b.score - a.score)
            .slice(0, recommendOption.maxResultSize);

        return result;
    }
}
