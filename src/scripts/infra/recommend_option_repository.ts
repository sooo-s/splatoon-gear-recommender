import {OptionT, None, Some} from "../domain/option";
import AbilityOption from "../domain/ability_option";
import RecommendOption from "../domain/recommend_option";
import RecommendOptionRepository from "../domain/recommend_option_repository";
import AbilityRepository from "../domain/ability_repository";

export default class RecommendOptionRepositoryImpl implements RecommendOptionRepository {
    constructor(private abilityRepository: AbilityRepository) {
    }

    store(option: RecommendOption): void {
        const data: RecommendOptionORM = {
            required: option.requiredAbilities.map(this.abilityOptiontoJSON),
            optional: option.optionalAbilities.map(this.abilityOptiontoJSON),
            maxResultSize: option.maxResultSize
        };
        location.hash = `#option=${encodeURIComponent(JSON.stringify(data)) }`;
    }

    get(): RecommendOption {
        const result = /#option=([^#]+)/.exec(location.href);
        if (result && result[1]) {
            const data: RecommendOptionORM = JSON.parse(decodeURIComponent(result[1]));
            return new RecommendOption(
                data.required.map(a => this.jsonToAbilityOption(a)),
                data.optional.map(a => this.jsonToAbilityOption(a)),
                data.maxResultSize
            );
        } else {
            return new RecommendOption([], this.abilityRepository.allAbilities().map(a => new AbilityOption(a, 0)), 30);
        }
    }

    private abilityOptiontoJSON(abilityOption: AbilityOption): AbilityOptionORM {
        return {
            id: abilityOption.ability.id,
            num: abilityOption.num
        };
    }

    private jsonToAbilityOption(json: AbilityOptionORM): AbilityOption {
        return new AbilityOption(this.abilityRepository.getById(json.id), json.num);
    }
}

interface RecommendOptionORM {
    required: AbilityOptionORM[];
    optional: AbilityOptionORM[];
    maxResultSize: number;
}

interface AbilityOptionORM {
    id: string;
    num: number;
}
