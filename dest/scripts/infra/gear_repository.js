var gear_combination_1 = require("../domain/gear_combination");
var all_gears_1 = require("./all_gears");
var LocalGearRepository = (function () {
    function LocalGearRepository() {
    }
    LocalGearRepository.prototype.allGears = function () {
        return all_gears_1.ALL_GEARS;
    };
    LocalGearRepository.prototype.allGearCombinations = function () {
        var gearList = this.allGears();
        var headGears = gearList.filter(function (gear) { return gear.gearType === 0; });
        var clothings = gearList.filter(function (gear) { return gear.gearType === 1; });
        var shoes = gearList.filter(function (gear) { return gear.gearType === 2; });
        var combinations = [];
        for (var _i = 0; _i < headGears.length; _i++) {
            var headGear = headGears[_i];
            for (var _a = 0; _a < clothings.length; _a++) {
                var clothing = clothings[_a];
                for (var _b = 0; _b < shoes.length; _b++) {
                    var shoe = shoes[_b];
                    combinations.push(new gear_combination_1.default(headGear, clothing, shoe));
                }
            }
        }
        return combinations;
    };
    return LocalGearRepository;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LocalGearRepository;
