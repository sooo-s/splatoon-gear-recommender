/// <reference path="../infra/typings/bundle.d.ts"/>

import Ability from "../domain/ability";
import AbilityOption from "../domain/ability_option";
import RecommendOption from "../domain/recommend_option";
import AbilityRepository from "../domain/ability_repository";

declare var itemplate: any;
declare var IncrementalDOM: any;

export default class RecommendOptionView {
    private elem: HTMLElement;
    private templateElem: HTMLElement;
    private onSubmitCallback: (recommendOption: RecommendOption) => void;
    private mainAbilityOnly: AbilityNumOption[] = [
        { label: '指定なし', value: 0, selected: false },
        { label: '4', value: 4, selected: false },
        { label: '8', value: 8, selected: false },
        { label: '12', value: 12, selected: false },
    ];
    private notMainAbilityOnly: AbilityNumOption[] = [
        { label: '指定なし', value: 0, selected: false },
        { label: '3', value: 3, selected: false },
        { label: '4', value: 4, selected: false },
        { label: '6', value: 6, selected: false },
        { label: '7', value: 7, selected: false },
        { label: '8', value: 8, selected: false },
        { label: '9', value: 9, selected: false },
        { label: '10', value: 10, selected: false },
        { label: '11', value: 11, selected: false },
        { label: '12', value: 12, selected: false },
        { label: '15', value: 15, selected: false },
        { label: '17', value: 17, selected: false },
        { label: '18', value: 18, selected: false },
        { label: '21', value: 21, selected: false },
    ];

    constructor(private abilityRepository: AbilityRepository, private maxResultSize = 30) {
    }

    render(elem: HTMLElement, templateElem: HTMLElement, initialRecommendOption: RecommendOption): RecommendOptionView {
        this.elem = elem;
        this.templateElem = templateElem;
        elem.addEventListener("submit", (e) => {
            e.preventDefault();
            this.onSubmit();
        });
        this.updateOption(initialRecommendOption);
        return this;
    }

    updateOption(recommendOption: RecommendOption): void {
        const required = recommendOption.requiredAbilities.map((a): [AbilityOption, boolean] => [a, true]);
        const optional = recommendOption.optionalAbilities.map((a): [AbilityOption, boolean] => [a, false]);
        const templateData = required.concat(optional).map(opt => {
            let [abilityOption, isRequired] = opt;
            return {
                id: abilityOption.ability.id,
                name: abilityOption.ability.name,
                isRequired: isRequired,
                nums: this.getNums(abilityOption.ability, abilityOption.num)
            };
        });
        const templateStr = this.templateElem.innerHTML;
        const renderFn = itemplate.compile(templateStr, IncrementalDOM);
        IncrementalDOM.patch(this.elem.querySelector('.ability-options'), function() {
            renderFn(templateData, IncrementalDOM);
        });
    }

    private getNums(ability: Ability, num: number): AbilityNumOption[] {
        return (ability.isMainAbilityOnly ? this.mainAbilityOnly : this.notMainAbilityOnly).map((a: AbilityNumOption): AbilityNumOption => {
            return {
                label: a.label,
                value: a.value,
                selected: a.value === num
            };
        })
    }

    private onSubmit(): void {
        if (!this.onSubmitCallback) {
            return;
        }
        const abilityOptions: AbilityInputState[] =
            Array.prototype.slice.call(this.elem.querySelectorAll('.ability'))
                .map(function(elem: HTMLElement) {
                    const id: string = elem.dataset['abilityId'];
                    const isRequired: boolean = (<HTMLInputElement>elem.querySelector('.is-required')).checked;
                    const num: number = parseInt((<HTMLInputElement>elem.querySelector('.num')).value, 10);
                    return { id, isRequired, num };
                });
        const requiredAbilities: AbilityOption[] = abilityOptions.filter(a => a.isRequired).map<AbilityOption>(this.toAbilityOption.bind(this));
        const optionalAbilities: AbilityOption[] = abilityOptions.filter(a => !a.isRequired).map<AbilityOption>(this.toAbilityOption.bind(this));
        const recommendOption = new RecommendOption(requiredAbilities, optionalAbilities, this.maxResultSize);
        this.onSubmitCallback(recommendOption);
    }

    private toAbilityOption(opt: any): AbilityOption {
        return new AbilityOption(this.abilityRepository.getById(opt.id), opt.num);
    }

    onRecommendOptionChanged(callback: (recommendOption: RecommendOption) => void) {
        this.onSubmitCallback = callback;
    }
}

interface AbilityInputState {
    id: string;
    name: string;
    isRequired: boolean;
    nums: AbilityNumOption[];
}

interface AbilityNumOption {
    label: string;
    value: number;
    selected: boolean;
}
