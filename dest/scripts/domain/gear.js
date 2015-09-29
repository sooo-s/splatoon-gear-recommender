var Gear = (function () {
    function Gear(gearName, brand, gearType, mainAbility) {
        this.gearName = gearName;
        this.brand = brand;
        this.gearType = gearType;
        this.mainAbility = mainAbility;
    }
    Gear.prototype.abilityNum = function (ability) {
        var abilityNum = 0;
        abilityNum += this.mainAbility.id === ability.id ? 4 : 0;
        abilityNum += this.brand.hasCommonAbility(ability) ? 3 : 0;
        return abilityNum;
    };
    return Gear;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Gear;
