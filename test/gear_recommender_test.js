var assert = require("assert");
var GearRecommender = require("../dest/scripts/domain/gear_recommender").default;
var RecommendOption = require("../dest/scripts/domain/recommend_option").default;
var all = require("../dest/scripts/app/all_gears");

describe("gear_recommender", function() {
    it('successfully recommned', function(done) {
        var requiredAbilities = [
            all.ALL_ABILITIES.DamegeUp, all.ALL_ABILITIES.SwimSpeedUp
        ];
        var optionalAbilities = [
            all.ALL_ABILITIES.NinjaSuquid, all.ALL_ABILITIES.InkResistanceUp,
        ];
        var option = new RecommendOption(requiredAbilities, optionalAbilities, 10);
        var gearRecommender = new GearRecommender(all.ALL_GEARS);
        var result = gearRecommender.recommend(option);
        assert(result.length === 10);
        done();
    });
});
