var RecommendOption = (function () {
    function RecommendOption(requiredAbilities, optionalAbilities, maxResultSize) {
        this.requiredAbilities = requiredAbilities;
        this.optionalAbilities = optionalAbilities;
        this.maxResultSize = maxResultSize;
    }
    RecommendOption.prototype.isRequirementSatisfiedWith = function (gears) {
        return this.requiredAbilities.every(function (opt) { return gears.hasAbility(opt.ability, opt.num); });
    };
    RecommendOption.prototype.getSatisfiedOptionalAbilitiesNum = function (gears) {
        return this.optionalAbilities.filter(function (a) { return gears.hasAbility(a.ability, a.num); }).length;
    };
    RecommendOption.prototype.isEmpty = function () {
        return this.requiredAbilities.concat(this.optionalAbilities).every(function (a) { return a.num === 0; });
    };
    return RecommendOption;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecommendOption;
