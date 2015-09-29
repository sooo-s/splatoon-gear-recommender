import Gear from "./gear";
import GearType from "./gear_type";
import GearCombination from "./gear_combination";

export default class GearCombinationsCreator {
    create(gearList: Gear[]): GearCombination[] {
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
