var GearCombination = (function () {
    function GearCombination(headGear, clothing, shoe) {
        this.headGear = headGear;
        this.clothing = clothing;
        this.shoe = shoe;
        this.gears = [];
        this.gears = [headGear, clothing, shoe];
    }
    GearCombination.prototype.hasAbility = function (ability, num) {
        return this.gears.reduce(function (acc, gear) { return acc + gear.abilityNum(ability); }, 0) >= num;
    };
    return GearCombination;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GearCombination;
