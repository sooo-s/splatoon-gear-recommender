import Ability from "../domain/ability";
import AbilityRepository from "../domain/ability_repository";
import {ALL_ABILITIES} from "./all_gears";

export default class LocalAbilityRepository implements AbilityRepository {
    private _allAbilities: Ability[] = null;

    allAbilities(): Ability[] {
        if (this._allAbilities) {
            return this._allAbilities;
        }

        let all_abilities: Ability[] = [];
        for (let key of Object.keys(ALL_ABILITIES)) {
            all_abilities.push(ALL_ABILITIES[key]);
        }
        this._allAbilities = all_abilities;
        return all_abilities;
    }

    getById(id: string): Ability {
        const result = ALL_ABILITIES[id];
        if (!result) {
            throw new Error(`${id} is not found.`);
        }
        return result;
    }
}
