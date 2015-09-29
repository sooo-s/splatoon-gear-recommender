var RecommendResultView = (function () {
    function RecommendResultView() {
    }
    RecommendResultView.prototype.mount = function (elem, templateElem) {
        this.container = elem.querySelector('.result-container');
        this.renderFn = itemplate.compile(templateElem.innerHTML, IncrementalDOM);
        return this;
    };
    RecommendResultView.prototype.show = function (result) {
        var _this = this;
        var resultData = result.map(function (r) {
            return {
                score: r.score,
                headGear: _this.createGearData(r.headGear),
                clothing: _this.createGearData(r.clothing),
                shoe: _this.createGearData(r.shoe)
            };
        });
        this.update({
            error: null,
            result: resultData
        });
    };
    RecommendResultView.prototype.showNoOption = function () {
        this.update({
            error: "no-option",
            result: []
        });
    };
    RecommendResultView.prototype.update = function (templateData) {
        var _this = this;
        IncrementalDOM.patch(this.container, function () {
            _this.renderFn(templateData, IncrementalDOM);
        });
    };
    RecommendResultView.prototype.createGearData = function (gear) {
        return {
            name: gear.gearName,
            mainAbilityId: gear.mainAbility.id,
            commonAbilityId: gear.brand.commonAbility.map(function (a) { return a.id; }).getOrElse(null),
            uncommonAbilityId: gear.brand.uncommonAbility.map(function (a) { return a.id; }).getOrElse(null),
        };
    };
    return RecommendResultView;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecommendResultView;
