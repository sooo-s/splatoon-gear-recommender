var ability_option_1 = require("../domain/ability_option");
var recommend_option_1 = require("../domain/recommend_option");
var RecommendOptionRepositoryImpl = (function () {
    function RecommendOptionRepositoryImpl(abilityRepository) {
        this.abilityRepository = abilityRepository;
    }
    RecommendOptionRepositoryImpl.prototype.store = function (option) {
        var data = {
            required: option.requiredAbilities.map(this.abilityOptiontoJSON),
            optional: option.optionalAbilities.map(this.abilityOptiontoJSON),
            maxResultSize: option.maxResultSize
        };
        location.hash = "#option=" + encodeURIComponent(JSON.stringify(data));
    };
    RecommendOptionRepositoryImpl.prototype.get = function () {
        var _this = this;
        var result = /#option=([^#]+)/.exec(location.href);
        if (result && result[1]) {
            var data = JSON.parse(decodeURIComponent(result[1]));
            return new recommend_option_1.default(data.required.map(function (a) { return _this.jsonToAbilityOption(a); }), data.optional.map(function (a) { return _this.jsonToAbilityOption(a); }), data.maxResultSize);
        }
        else {
            return new recommend_option_1.default([], this.abilityRepository.allAbilities().map(function (a) { return new ability_option_1.default(a, 0); }), 30);
        }
    };
    RecommendOptionRepositoryImpl.prototype.abilityOptiontoJSON = function (abilityOption) {
        return {
            id: abilityOption.ability.id,
            num: abilityOption.num
        };
    };
    RecommendOptionRepositoryImpl.prototype.jsonToAbilityOption = function (json) {
        return new ability_option_1.default(this.abilityRepository.getById(json.id), json.num);
    };
    return RecommendOptionRepositoryImpl;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecommendOptionRepositoryImpl;
