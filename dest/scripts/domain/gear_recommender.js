var recommend_result_1 = require("./recommend_result");
var GearRecommender = (function () {
    function GearRecommender(gearCombinations) {
        this.gearCombinations = gearCombinations;
    }
    GearRecommender.prototype.recommend = function (recommendOption) {
        var result = this.gearCombinations
            .map(function (gears) {
            var value = 0;
            if (!recommendOption.isRequirementSatisfiedWith(gears)) {
                value = 0;
            }
            else {
                value = recommendOption.getSatisfiedOptionalAbilitiesNum(gears);
            }
            return { gears: gears, value: value };
        })
            .filter(function (result) { return result.value > 0; })
            .map(function (result) { return new recommend_result_1.default(result.gears, result.value); })
            .sort(function (a, b) { return b.score - a.score; })
            .slice(0, recommendOption.maxResultSize);
        return result;
    };
    return GearRecommender;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GearRecommender;
