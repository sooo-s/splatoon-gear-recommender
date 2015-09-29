var all_gears_1 = require("./all_gears");
var LocalAbilityRepository = (function () {
    function LocalAbilityRepository() {
        this._allAbilities = null;
    }
    LocalAbilityRepository.prototype.allAbilities = function () {
        if (this._allAbilities) {
            return this._allAbilities;
        }
        var all_abilities = [];
        for (var _i = 0, _a = Object.keys(all_gears_1.ALL_ABILITIES); _i < _a.length; _i++) {
            var key = _a[_i];
            all_abilities.push(all_gears_1.ALL_ABILITIES[key]);
        }
        this._allAbilities = all_abilities;
        return all_abilities;
    };
    LocalAbilityRepository.prototype.getById = function (id) {
        var result = all_gears_1.ALL_ABILITIES[id];
        if (!result) {
            throw new Error(id + " is not found.");
        }
        return result;
    };
    return LocalAbilityRepository;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LocalAbilityRepository;
