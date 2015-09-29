var gear_combination_1 = require("./gear_combination");
var GearCombinationsCreator = (function () {
    function GearCombinationsCreator() {
    }
    GearCombinationsCreator.prototype.create = function (gearList) {
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
    return GearCombinationsCreator;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GearCombinationsCreator;
