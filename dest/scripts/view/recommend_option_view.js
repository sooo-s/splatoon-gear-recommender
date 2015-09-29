/// <reference path="../infra/typings/bundle.d.ts"/>
var ability_option_1 = require("../domain/ability_option");
var recommend_option_1 = require("../domain/recommend_option");
var RecommendOptionView = (function () {
    function RecommendOptionView(abilityRepository, maxResultSize) {
        if (maxResultSize === void 0) { maxResultSize = 30; }
        this.abilityRepository = abilityRepository;
        this.maxResultSize = maxResultSize;
        this.mainAbilityOnly = [
            { label: '指定なし', value: 0, selected: false },
            { label: '4', value: 4, selected: false },
            { label: '8', value: 8, selected: false },
            { label: '12', value: 12, selected: false },
        ];
        this.notMainAbilityOnly = [
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
    }
    RecommendOptionView.prototype.render = function (elem, templateElem, initialRecommendOption) {
        var _this = this;
        this.elem = elem;
        this.templateElem = templateElem;
        elem.addEventListener("submit", function (e) {
            e.preventDefault();
            _this.onSubmit();
        });
        this.updateOption(initialRecommendOption);
        return this;
    };
    RecommendOptionView.prototype.updateOption = function (recommendOption) {
        var _this = this;
        var required = recommendOption.requiredAbilities.map(function (a) { return [a, true]; });
        var optional = recommendOption.optionalAbilities.map(function (a) { return [a, false]; });
        var templateData = required.concat(optional).map(function (opt) {
            var abilityOption = opt[0], isRequired = opt[1];
            return {
                id: abilityOption.ability.id,
                name: abilityOption.ability.name,
                isRequired: isRequired,
                nums: _this.getNums(abilityOption.ability, abilityOption.num)
            };
        });
        var templateStr = this.templateElem.innerHTML;
        var renderFn = itemplate.compile(templateStr, IncrementalDOM);
        IncrementalDOM.patch(this.elem.querySelector('.ability-options'), function () {
            renderFn(templateData, IncrementalDOM);
        });
    };
    RecommendOptionView.prototype.getNums = function (ability, num) {
        return (ability.isMainAbilityOnly ? this.mainAbilityOnly : this.notMainAbilityOnly).map(function (a) {
            return {
                label: a.label,
                value: a.value,
                selected: a.value === num
            };
        });
    };
    RecommendOptionView.prototype.onSubmit = function () {
        if (!this.onSubmitCallback) {
            return;
        }
        var abilityOptions = Array.prototype.slice.call(this.elem.querySelectorAll('.ability'))
            .map(function (elem) {
            var id = elem.dataset['abilityId'];
            var isRequired = elem.querySelector('.is-required').checked;
            var num = parseInt(elem.querySelector('.num').value, 10);
            return { id: id, isRequired: isRequired, num: num };
        });
        var requiredAbilities = abilityOptions.filter(function (a) { return a.isRequired; }).map(this.toAbilityOption.bind(this));
        var optionalAbilities = abilityOptions.filter(function (a) { return !a.isRequired; }).map(this.toAbilityOption.bind(this));
        var recommendOption = new recommend_option_1.default(requiredAbilities, optionalAbilities, this.maxResultSize);
        this.onSubmitCallback(recommendOption);
    };
    RecommendOptionView.prototype.toAbilityOption = function (opt) {
        return new ability_option_1.default(this.abilityRepository.getById(opt.id), opt.num);
    };
    RecommendOptionView.prototype.onRecommendOptionChanged = function (callback) {
        this.onSubmitCallback = callback;
    };
    return RecommendOptionView;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecommendOptionView;
