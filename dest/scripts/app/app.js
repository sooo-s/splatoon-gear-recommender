///<reference path="./node_modules/option-t/option-t.d.ts" />
var gear_recommender_1 = require("../domain/gear_recommender");
var recommend_option_view_1 = require("../view/recommend_option_view");
var recommend_result_view_1 = require("../view/recommend_result_view");
var gear_repository_1 = require("../infra/gear_repository");
var ability_repository_1 = require("../infra/ability_repository");
var recommend_option_repository_1 = require("../infra/recommend_option_repository");
window.addEventListener('DOMContentLoaded', function () {
    var id = function (idStr) { return document.getElementById(idStr); };
    var gearRepository = new gear_repository_1.default();
    var abilityRepository = new ability_repository_1.default();
    var recommendOptionRepository = new recommend_option_repository_1.default(abilityRepository);
    var initialRecommendOption = recommendOptionRepository.get();
    console.log(initialRecommendOption);
    var recommender = new gear_recommender_1.default(gearRepository.allGearCombinations());
    var recommendOptionView = new recommend_option_view_1.default(abilityRepository, initialRecommendOption.maxResultSize)
        .render(id('recommend-option'), id('ability-option-template'), initialRecommendOption);
    var recommendResultView = new recommend_result_view_1.default().mount(id('recommend-result'), id('recomment-result-row-template'));
    recommendOptionView.updateOption(initialRecommendOption);
    if (!initialRecommendOption.isEmpty) {
        recommendResultView.show(recommender.recommend(initialRecommendOption));
    }
    recommendOptionView.onRecommendOptionChanged(function (option) {
        recommendOptionRepository.store(option);
        if (option.isEmpty()) {
            recommendResultView.showNoOption();
        }
        else {
            recommendResultView.show(recommender.recommend(option));
        }
    });
});
