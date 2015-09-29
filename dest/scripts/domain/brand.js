var Brand = (function () {
    function Brand(id, name, commonAbility, uncommonAbility) {
        this.id = id;
        this.name = name;
        this.commonAbility = commonAbility;
        this.uncommonAbility = uncommonAbility;
    }
    Brand.prototype.hasCommonAbility = function (ability) {
        return this.commonAbility.exists(function (a) { return a.id === ability.id; });
    };
    Brand.prototype.hasUncommonAbility = function (ability) {
        return this.uncommonAbility.exists(function (a) { return a.id === ability.id; });
    };
    Brand.prototype.equalsTo = function (brand) {
        return brand instanceof Brand && brand.id === this.id;
    };
    return Brand;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Brand;
