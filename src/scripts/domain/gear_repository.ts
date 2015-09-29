import GearCombination from "./gear_combination";

interface GearRepository {
    allGearCombinations(): GearCombination[];
}

export default GearRepository;
