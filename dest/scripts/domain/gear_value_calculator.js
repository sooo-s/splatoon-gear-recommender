var GearValueCalculator = (function () {
    function GearValueCalculator(recommendOption) {
        this.recommendOption = recommendOption;
    }
    GearValueCalculator.prototype.calc = function (gears) {
        if (!this.recommendOption.requiredAbilities.every(function (opt) { return gears.hasAbility(opt.ability, opt.num); })) {
            return 0;
        }
        return this.recommendOption.optionalAbilities.reduce(function (acc, opt) {
            return acc + (gears.hasAbility(opt.ability, opt.num) ? 1 : 0);
        }, 0);
    };
    return GearValueCalculator;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GearValueCalculator;
