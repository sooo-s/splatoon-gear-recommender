///<reference path="./node_modules/option-t/option-t.d.ts" />

import Ability from "../domain/ability";
import GearRecommender from "../domain/gear_recommender";
import RecommendOption from "../domain/recommend_option";
import RecommendOptionView from "../view/recommend_option_view";
import RecommendResultView from "../view/recommend_result_view";
import LocalGearRepository from "../infra/gear_repository";
import LocalAbilityRepository from "../infra/ability_repository";
import RecommendOptionRepositoryImpl from "../infra/recommend_option_repository";

window.addEventListener('DOMContentLoaded', () => {
    const id = function(idStr: string): HTMLElement { return <HTMLElement>document.getElementById(idStr) };

    const gearRepository = new LocalGearRepository();
    const abilityRepository = new LocalAbilityRepository();
    const recommendOptionRepository = new RecommendOptionRepositoryImpl(abilityRepository);

    const initialRecommendOption = recommendOptionRepository.get();
    console.log(initialRecommendOption);

    let recommender = new GearRecommender(gearRepository.allGearCombinations());
    let recommendOptionView = new RecommendOptionView(abilityRepository, initialRecommendOption.maxResultSize)
        .render(id('recommend-option'), id('ability-option-template'), initialRecommendOption);
    let recommendResultView = new RecommendResultView().mount(id('recommend-result'), id('recomment-result-row-template'));

    //init
    recommendOptionView.updateOption(initialRecommendOption);

    if (!initialRecommendOption.isEmpty) {
        recommendResultView.show(recommender.recommend(initialRecommendOption));
    }

    recommendOptionView.onRecommendOptionChanged((option: RecommendOption) => {
        recommendOptionRepository.store(option);
        if (option.isEmpty()) {
            recommendResultView.showNoOption();
        } else {
            recommendResultView.show(recommender.recommend(option));
        }
    });
});
