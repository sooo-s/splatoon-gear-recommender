import Ability from "./ability";

interface AbilityRepository {
    allAbilities(): Ability[];
    getById(id: string): Ability;
}

export default AbilityRepository;
