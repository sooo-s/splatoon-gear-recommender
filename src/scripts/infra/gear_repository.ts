import Gear from "../domain/gear";
import GearType from "../domain/gear_type";
import GearCombination from "../domain/gear_combination";
import GearRepository from "../domain/gear_repository";
import {ALL_GEARS} from "./all_gears";

export default class LocalGearRepository implements GearRepository {
    private allGears(): Gear[] {
        return ALL_GEARS;
    }

    allGearCombinations(): GearCombination[] {
        const gearList = this.allGears();
        let headGears = gearList.filter(gear => gear.gearType === GearType.HeadGear);
        let clothings = gearList.filter(gear => gear.gearType === GearType.Clothing);
        let shoes = gearList.filter(gear => gear.gearType === GearType.Shoes);

        let combinations: GearCombination[] = [];
        for (let headGear of headGears) {
            for (let clothing of clothings) {
                for (let shoe of shoes) {
                    combinations.push(new GearCombination(headGear, clothing, shoe));
                }
            }
        }
        return combinations;
    }
}
