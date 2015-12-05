(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../domain/gear_recommender":7,"../infra/ability_repository":11,"../infra/gear_repository":13,"../infra/recommend_option_repository":14,"../view/recommend_option_view":15,"../view/recommend_result_view":16}],2:[function(require,module,exports){
var Ability = (function () {
    function Ability(id, name, isMainAbilityOnly) {
        this.id = id;
        this.name = name;
        this.isMainAbilityOnly = isMainAbilityOnly;
    }
    return Ability;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Ability;

},{}],3:[function(require,module,exports){
var AbilityOption = (function () {
    function AbilityOption(ability, num) {
        this.ability = ability;
        this.num = num;
    }
    return AbilityOption;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AbilityOption;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
var Gear = (function () {
    function Gear(gearName, brand, gearType, mainAbility) {
        this.gearName = gearName;
        this.brand = brand;
        this.gearType = gearType;
        this.mainAbility = mainAbility;
    }
    Gear.prototype.abilityNum = function (ability) {
        var abilityNum = 0;
        abilityNum += this.mainAbility.id === ability.id ? 4 : 0;
        abilityNum += this.brand.hasCommonAbility(ability) ? 3 : 0;
        return abilityNum;
    };
    return Gear;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Gear;

},{}],6:[function(require,module,exports){
var GearCombination = (function () {
    function GearCombination(headGear, clothing, shoe) {
        this.headGear = headGear;
        this.clothing = clothing;
        this.shoe = shoe;
        this.gears = [];
        this.gears = [headGear, clothing, shoe];
    }
    GearCombination.prototype.hasAbility = function (ability, num) {
        return this.gears.reduce(function (acc, gear) { return acc + gear.abilityNum(ability); }, 0) >= num;
    };
    return GearCombination;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GearCombination;

},{}],7:[function(require,module,exports){
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

},{"./recommend_result":10}],8:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OptionT = (function () {
    function OptionT() {
    }
    OptionT.prototype.map = function (f) {
        return this.isEmpty ? new None : new Some(f(this.get()));
    };
    OptionT.prototype.flatMap = function (f) {
        return this.isEmpty ? new None : f(this.get());
    };
    OptionT.prototype.getOrElse = function (d) {
        return this.isEmpty ? d : this.get();
    };
    OptionT.prototype.filter = function (f) {
        return (this.isEmpty || f(this.get())) ? this : new None;
    };
    OptionT.prototype.exists = function (f) {
        return !this.isEmpty && f(this.get());
    };
    return OptionT;
})();
exports.OptionT = OptionT;
var Some = (function (_super) {
    __extends(Some, _super);
    function Some(value) {
        var _this = this;
        _super.call(this);
        this.value = value;
        this.isEmpty = false;
        this.get = function () { return _this.value; };
    }
    return Some;
})(OptionT);
exports.Some = Some;
var None = (function (_super) {
    __extends(None, _super);
    function None() {
        _super.apply(this, arguments);
        this.isEmpty = true;
        this.get = function () { throw ""; ""; };
    }
    return None;
})(OptionT);
exports.None = None;
exports.Optional = function (value) {
    return value ? new Some(value) : new None;
};

},{}],9:[function(require,module,exports){
var RecommendOption = (function () {
    function RecommendOption(requiredAbilities, optionalAbilities, maxResultSize) {
        this.requiredAbilities = requiredAbilities;
        this.optionalAbilities = optionalAbilities;
        this.maxResultSize = maxResultSize;
    }
    RecommendOption.prototype.isRequirementSatisfiedWith = function (gears) {
        return this.requiredAbilities.every(function (opt) { return gears.hasAbility(opt.ability, opt.num); });
    };
    RecommendOption.prototype.getSatisfiedOptionalAbilitiesNum = function (gears) {
        return this.optionalAbilities.filter(function (a) { return gears.hasAbility(a.ability, a.num); }).length;
    };
    RecommendOption.prototype.isEmpty = function () {
        return this.requiredAbilities.concat(this.optionalAbilities).every(function (a) { return a.num === 0; });
    };
    return RecommendOption;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecommendOption;

},{}],10:[function(require,module,exports){
var RecommendResult = (function () {
    function RecommendResult(combination, score) {
        this.headGear = combination.headGear;
        this.clothing = combination.clothing;
        this.shoe = combination.shoe;
        this.score = score;
    }
    return RecommendResult;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecommendResult;

},{}],11:[function(require,module,exports){
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

},{"./all_gears":12}],12:[function(require,module,exports){
var option_1 = require("../domain/option");
var ability_1 = require("../domain/ability");
var brand_1 = require("../domain/brand");
var gear_1 = require("../domain/gear");
exports.ALL_ABILITIES = {
    damage_up: new ability_1.default("damage_up", "攻撃力アップ", false),
    defence_up: new ability_1.default("defence_up", "防御力アップ", false),
    ink_saver_main: new ability_1.default("ink_saver_main", "インク効率アップ（メイン）", false),
    ink_saver_sub: new ability_1.default("ink_saver_sub", "インク効率アップ（サブ）", false),
    ink_recovery_up: new ability_1.default("ink_recovery_up", "インク回復力アップ", false),
    run_speed_up: new ability_1.default("run_speed_up", "ヒト移動速度アップ", false),
    swim_speed_up: new ability_1.default("swim_speed_up", "イカダッシュ速度アップ", false),
    special_charge_up: new ability_1.default("special_charge_up", "スペシャル増加量アップ", false),
    special_duration_up: new ability_1.default("special_duration_up", "スペシャル時間延長", false),
    quick_respawn: new ability_1.default("quick_respawn", "復活時間短縮", false),
    special_saver: new ability_1.default("special_saver", "スペシャル減少量ダウン", false),
    quick_super_jump: new ability_1.default("quick_super_jump", "スーパージャンプ時間短縮", false),
    bomb_range_up: new ability_1.default("bomb_range_up", "ボム飛距離アップ", true),
    opening_gambit: new ability_1.default("opening_gambit", "スタートダッシュ", true),
    last_ditch_effort: new ability_1.default("last_ditch_effort", "ラストスパート", true),
    tenacity: new ability_1.default("tenacity", "逆境強化", true),
    come_back: new ability_1.default("come_back", "カムバック", true),
    cold_blooded: new ability_1.default("cold_blooded", "マーキングガード", true),
    ninja_squid: new ability_1.default("ninja_squid", "イカニンジャ", true),
    haunt: new ability_1.default("haunt", "うらみ", true),
    recon: new ability_1.default("recon", "スタートレーダー", true),
    bomb_sniffer: new ability_1.default("bomb_sniffer", "ボムサーチ", true),
    ink_resistance_up: new ability_1.default("ink_resistance_up", "安全シューズ", true),
    stealth_jump: new ability_1.default("stealth_jump", "ステルスジャンプ", true)
};
exports.ALL_BRANDS = {
    Zink: new brand_1.default('zink', 'アイロニック', option_1.Optional(exports.ALL_ABILITIES.quick_super_jump), option_1.Optional(exports.ALL_ABILITIES.quick_respawn)),
    Tentatk: new brand_1.default('tentatk', 'アロメ', option_1.Optional(exports.ALL_ABILITIES.ink_recovery_up), option_1.Optional(exports.ALL_ABILITIES.quick_super_jump)),
    Zekko: new brand_1.default('zekko', 'エゾッコ', option_1.Optional(exports.ALL_ABILITIES.special_saver), option_1.Optional(exports.ALL_ABILITIES.special_charge_up)),
    KrakOn: new brand_1.default('krak_on', 'クラーゲス', option_1.Optional(exports.ALL_ABILITIES.swim_speed_up), option_1.Optional(exports.ALL_ABILITIES.defence_up)),
    Inkline: new brand_1.default('inkline', 'シグレニ', option_1.Optional(exports.ALL_ABILITIES.defence_up), option_1.Optional(exports.ALL_ABILITIES.damage_up)),
    SplashMob: new brand_1.default('splash_mob', 'ジモン', option_1.Optional(exports.ALL_ABILITIES.ink_saver_main), option_1.Optional(exports.ALL_ABILITIES.run_speed_up)),
    SquidForce: new brand_1.default('squid_force', 'バトロイカ', option_1.Optional(exports.ALL_ABILITIES.damage_up), option_1.Optional(exports.ALL_ABILITIES.ink_saver_main)),
    Forge: new brand_1.default('forge', 'フォーリマ', option_1.Optional(exports.ALL_ABILITIES.special_duration_up), option_1.Optional(exports.ALL_ABILITIES.ink_saver_sub)),
    Skalop: new brand_1.default('skalop', 'ホタックス', option_1.Optional(exports.ALL_ABILITIES.quick_respawn), option_1.Optional(exports.ALL_ABILITIES.special_saver)),
    Firefin: new brand_1.default('firefin', 'ホッコリー', option_1.Optional(exports.ALL_ABILITIES.ink_saver_sub), option_1.Optional(exports.ALL_ABILITIES.ink_recovery_up)),
    Takoroka: new brand_1.default('takoroka', 'ヤコ', option_1.Optional(exports.ALL_ABILITIES.special_charge_up), option_1.Optional(exports.ALL_ABILITIES.special_duration_up)),
    Rockenberg: new brand_1.default('rockenberg', 'ロッケンベルグ', option_1.Optional(exports.ALL_ABILITIES.run_speed_up), option_1.Optional(exports.ALL_ABILITIES.swim_speed_up)),
    Cuttlegear: new brand_1.default('cuttlegear', 'アタリメイド', option_1.Optional(null), option_1.Optional(null)),
    KOG: new brand_1.default('kog', 'KOG', option_1.Optional(null), option_1.Optional(null)),
    Amiibo: new brand_1.default('amiibo', 'amiibo', option_1.Optional(null), option_1.Optional(null)),
    TheSQUIDGIRL: new brand_1.default('the_squid_girl', '侵略！イカ娘', option_1.Optional(null), option_1.Optional(null)),
    Famitsu: new brand_1.default('famitsu', 'ファミ通', option_1.Optional(null), option_1.Optional(null))
};
exports.ALL_GEARS = [
    new gear_1.default('スカッシュバンド', exports.ALL_BRANDS.Zink, 0, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('サムライヘルメット', exports.ALL_BRANDS.Amiibo, 0, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('ダイバーゴーグル', exports.ALL_BRANDS.Forge, 0, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('でんせつのぼうし', exports.ALL_BRANDS.Cuttlegear, 0, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('ヤコメッシュ', exports.ALL_BRANDS.Takoroka, 0, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('スプラッシュゴーグル', exports.ALL_BRANDS.Forge, 0, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('チャリキング帽', exports.ALL_BRANDS.Tentatk, 0, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('パワードマスク', exports.ALL_BRANDS.Amiibo, 0, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('ショートビーニー', exports.ALL_BRANDS.Inkline, 0, exports.ALL_ABILITIES.ink_saver_main),
    new gear_1.default('スゲ', exports.ALL_BRANDS.Inkline, 0, exports.ALL_ABILITIES.ink_saver_main),
    new gear_1.default('スタジオヘッドホン', exports.ALL_BRANDS.Forge, 0, exports.ALL_ABILITIES.ink_saver_main),
    new gear_1.default('サファリハット', exports.ALL_BRANDS.Firefin, 0, exports.ALL_ABILITIES.ink_saver_main),
    new gear_1.default('バスケバンド', exports.ALL_BRANDS.Zink, 0, exports.ALL_ABILITIES.opening_gambit),
    new gear_1.default('テッカサイクルキャップ', exports.ALL_BRANDS.Zink, 0, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('キャディ サンバイザー', exports.ALL_BRANDS.Zink, 0, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('テニスバンド', exports.ALL_BRANDS.Tentatk, 0, exports.ALL_ABILITIES.come_back),
    new gear_1.default('イロメガネ', exports.ALL_BRANDS.Zekko, 0, exports.ALL_ABILITIES.last_ditch_effort),
    new gear_1.default('エゾッコメッシュ', exports.ALL_BRANDS.Zekko, 0, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('バックワードキャップ', exports.ALL_BRANDS.Zekko, 0, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('ランニングバンド', exports.ALL_BRANDS.Zekko, 0, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('2ラインメッシュ', exports.ALL_BRANDS.KrakOn, 0, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('キャンプハット', exports.ALL_BRANDS.Inkline, 0, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('キャンプキャップ', exports.ALL_BRANDS.Inkline, 0, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('クロブチ レトロ', exports.ALL_BRANDS.SplashMob, 0, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('ヘッドバンド ホワイト', exports.ALL_BRANDS.SquidForce, 0, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('ウインターボンボン', exports.ALL_BRANDS.Skalop, 0, exports.ALL_ABILITIES.tenacity),
    new gear_1.default('ウーニーズBBキャップ', exports.ALL_BRANDS.Skalop, 0, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('ビバレッジキャップ', exports.ALL_BRANDS.Skalop, 0, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('イカンカン', exports.ALL_BRANDS.Skalop, 0, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('ヤキフグ サンバイザー', exports.ALL_BRANDS.Firefin, 0, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('ジェットキャップ', exports.ALL_BRANDS.Firefin, 0, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('フグベルハット', exports.ALL_BRANDS.Firefin, 0, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('ダテコンタクト', exports.ALL_BRANDS.Tentatk, 0, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('サンサンサンバイザー', exports.ALL_BRANDS.Tentatk, 0, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('5パネルキャップ', exports.ALL_BRANDS.Zekko, 0, exports.ALL_ABILITIES.come_back),
    new gear_1.default('アローバンド ブラック', exports.ALL_BRANDS.Zekko, 0, exports.ALL_ABILITIES.tenacity),
    new gear_1.default('ボンボンニット', exports.ALL_BRANDS.SplashMob, 0, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('ボーダービーニー', exports.ALL_BRANDS.SplashMob, 0, exports.ALL_ABILITIES.opening_gambit),
    new gear_1.default('ロブスターブーニー', exports.ALL_BRANDS.Forge, 0, exports.ALL_ABILITIES.last_ditch_effort),
    new gear_1.default('オーロラヘッドホン', exports.ALL_BRANDS.Forge, 0, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('スケボーメット', exports.ALL_BRANDS.Skalop, 0, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('イカベーダーキャップ', exports.ALL_BRANDS.Skalop, 0, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('カモメッシュ', exports.ALL_BRANDS.Firefin, 0, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('ヒーローヘッズ レプリカ', exports.ALL_BRANDS.Cuttlegear, 0, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('タコゾネススコープ', exports.ALL_BRANDS.Cuttlegear, 0, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('イカパッチン', exports.ALL_BRANDS.Amiibo, 0, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('タイショウのはちまき', exports.ALL_BRANDS.Famitsu, 0, exports.ALL_ABILITIES.come_back),
    new gear_1.default('イカ娘ずきん', exports.ALL_BRANDS.TheSQUIDGIRL, 0, exports.ALL_ABILITIES.opening_gambit),
    new gear_1.default('アローバンド ホワイト', exports.ALL_BRANDS.Zekko, 0, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('タコマスク', exports.ALL_BRANDS.Forge, 0, exports.ALL_ABILITIES.tenacity),
    new gear_1.default('パイロットゴーグル', exports.ALL_BRANDS.Forge, 0, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('フェイスゴーグル', exports.ALL_BRANDS.Forge, 0, exports.ALL_ABILITIES.come_back),
    new gear_1.default('ナイトビジョン', exports.ALL_BRANDS.Forge, 0, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('テンタクルズメット', exports.ALL_BRANDS.Forge, 0, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('サイクルメット', exports.ALL_BRANDS.Skalop, 0, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('チドリキャップ', exports.ALL_BRANDS.Skalop, 0, exports.ALL_ABILITIES.opening_gambit),
    new gear_1.default('バイザーメット', exports.ALL_BRANDS.Skalop, 0, exports.ALL_ABILITIES.last_ditch_effort),
    new gear_1.default('タレサン18K', exports.ALL_BRANDS.Rockenberg, 0, exports.ALL_ABILITIES.last_ditch_effort),
    new gear_1.default('アーマーメット　レプリカ', exports.ALL_BRANDS.Cuttlegear, 0, exports.ALL_ABILITIES.tenacity),
    new gear_1.default('イカスカルマスク', exports.ALL_BRANDS.Forge, 0, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('イカノルディック', exports.ALL_BRANDS.Skalop, 0, exports.ALL_ABILITIES.come_back),
    new gear_1.default('イカンカン クラシック', exports.ALL_BRANDS.Skalop, 0, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('イヤーマフ', exports.ALL_BRANDS.Forge, 0, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('エイズリーバンダナ', exports.ALL_BRANDS.KrakOn, 0, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('オクタグラス', exports.ALL_BRANDS.Firefin, 0, exports.ALL_ABILITIES.last_ditch_effort),
    new gear_1.default('サッカーバンド', exports.ALL_BRANDS.Tentatk, 0, exports.ALL_ABILITIES.tenacity),
    new gear_1.default('トレジャーメット', exports.ALL_BRANDS.Forge, 0, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('マルベッコー', exports.ALL_BRANDS.KrakOn, 0, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('モンゴウベレー', exports.ALL_BRANDS.Forge, 0, exports.ALL_ABILITIES.opening_gambit),
    new gear_1.default('ウーニーズBBシャツ', exports.ALL_BRANDS.Zink, 1, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('アイロニックロング', exports.ALL_BRANDS.Zink, 1, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('アイロニックレイヤード', exports.ALL_BRANDS.Zink, 1, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('バスケジャージ アウェイ', exports.ALL_BRANDS.Zink, 1, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('かくれパイレーツ', exports.ALL_BRANDS.Tentatk, 1, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('イカノメT ライトブルー', exports.ALL_BRANDS.Tentatk, 1, exports.ALL_ABILITIES.cold_blooded),
    new gear_1.default('イカノメT ブラック', exports.ALL_BRANDS.Tentatk, 1, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('エゾッコラグラン', exports.ALL_BRANDS.Zekko, 1, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('イカゴッチンベスト', exports.ALL_BRANDS.KrakOn, 1, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('レイニーブルーT', exports.ALL_BRANDS.KrakOn, 1, exports.ALL_ABILITIES.ink_saver_main),
    new gear_1.default('サニーオレンジT', exports.ALL_BRANDS.KrakOn, 1, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('ヤマビコT ブルー', exports.ALL_BRANDS.Inkline, 1, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('ボーダーモスグリーン', exports.ALL_BRANDS.Inkline, 1, exports.ALL_ABILITIES.ninja_squid),
    new gear_1.default('ヤマビコT アイボリー', exports.ALL_BRANDS.Inkline, 1, exports.ALL_ABILITIES.haunt),
    new gear_1.default('シャンブレーシャツ', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('パイレーツボーダー', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('カレッジスウェット グレー', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('カレッジラグラン', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.recon),
    new gear_1.default('さくらエビポロ', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.ninja_squid),
    new gear_1.default('マリンボーダー', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('よもぎポロ', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.cold_blooded),
    new gear_1.default('レタード　オレンジ', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('カレッジスウェット　ネイビー', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('イカバッテンロング', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.haunt),
    new gear_1.default('イカホワイト', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('イカブラック', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('わかばイカT', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('イカバッテンマスタード', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('レイヤード ホワイト', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('レイヤード ブラック', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.ink_saver_main),
    new gear_1.default('マスタードガサネ', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('カモガサネ', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('おどるイカアロハ', exports.ALL_BRANDS.Forge, 1, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('グレープT', exports.ALL_BRANDS.Skalop, 1, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('ミントT', exports.ALL_BRANDS.Skalop, 1, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('チドリメロンＴ', exports.ALL_BRANDS.Skalop, 1, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('ヤキフグ8bit ホワイト', exports.ALL_BRANDS.Firefin, 1, exports.ALL_ABILITIES.recon),
    new gear_1.default('ニクショクT', exports.ALL_BRANDS.Firefin, 1, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('ヤキフグ8bit ブラック', exports.ALL_BRANDS.Firefin, 1, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('トリコロールラガー', exports.ALL_BRANDS.Takoroka, 1, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('ベクトルパターン グレー', exports.ALL_BRANDS.Takoroka, 1, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('ベクトルパターン レッド', exports.ALL_BRANDS.Takoroka, 1, exports.ALL_ABILITIES.ink_saver_main),
    new gear_1.default('ハラグロラグラン', exports.ALL_BRANDS.Rockenberg, 1, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('マルエリシャツ', exports.ALL_BRANDS.Rockenberg, 1, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('ロッケンベルグT ブラック', exports.ALL_BRANDS.Rockenberg, 1, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('ハラシロラグラン', exports.ALL_BRANDS.Rockenberg, 1, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('ドカンT ブラック', exports.ALL_BRANDS.KOG, 1, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('ラインT ホワイト', exports.ALL_BRANDS.KOG, 1, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('テッカサイクルシャツ', exports.ALL_BRANDS.Zink, 1, exports.ALL_ABILITIES.cold_blooded),
    new gear_1.default('スクールジャージー', exports.ALL_BRANDS.Zink, 1, exports.ALL_ABILITIES.ninja_squid),
    new gear_1.default('バスケジャージ ホーム', exports.ALL_BRANDS.Zink, 1, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('ギンガムチェック アカ', exports.ALL_BRANDS.Zekko, 1, exports.ALL_ABILITIES.ink_saver_main),
    new gear_1.default('バニーポップ ブラック', exports.ALL_BRANDS.Zekko, 1, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('エゾッコパーカー アズキ', exports.ALL_BRANDS.Zekko, 1, exports.ALL_ABILITIES.ninja_squid),
    new gear_1.default('ロゴマシマシアロハ', exports.ALL_BRANDS.Zekko, 1, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('ミックスシャツグレー', exports.ALL_BRANDS.Zekko, 1, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('ギンガムチェック ミドリ', exports.ALL_BRANDS.Zekko, 1, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('マウンテンベリー', exports.ALL_BRANDS.Inkline, 1, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('ブロックストライプシャツ', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('レタード　グリーン', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.recon),
    new gear_1.default('ボーダーホワイト', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('ボーダーネイビー', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('ベイビークラゲシャツ', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('シロシャツ', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('イカリスウェット', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.cold_blooded),
    new gear_1.default('ガチブラック', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.recon),
    new gear_1.default('グリーンＴ', exports.ALL_BRANDS.Forge, 1, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('ホッコリー ネイビー', exports.ALL_BRANDS.Firefin, 1, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('アーバンベスト イエロー', exports.ALL_BRANDS.Firefin, 1, exports.ALL_ABILITIES.haunt),
    new gear_1.default('ジップアップ グリーン', exports.ALL_BRANDS.Firefin, 1, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('ベクトルラインガサネ', exports.ALL_BRANDS.Takoroka, 1, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('オレンジボーダーラガー', exports.ALL_BRANDS.Takoroka, 1, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('チョコガサネ', exports.ALL_BRANDS.Takoroka, 1, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('ロッケンベルグT ホワイト', exports.ALL_BRANDS.Rockenberg, 1, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('ヒーロージャケット レプリカ', exports.ALL_BRANDS.Cuttlegear, 1, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('タコゾネスプロテクター', exports.ALL_BRANDS.Cuttlegear, 1, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('パワードスーツ', exports.ALL_BRANDS.Amiibo, 1, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('サムライジャケット', exports.ALL_BRANDS.Amiibo, 1, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('スクールブレザー', exports.ALL_BRANDS.Amiibo, 1, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('タイショウのまえかけ', exports.ALL_BRANDS.Famitsu, 1, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('イカ娘ノースリーブ', exports.ALL_BRANDS.TheSQUIDGIRL, 1, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('FCジャージー', exports.ALL_BRANDS.Zink, 1, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('チャリキングジャージ', exports.ALL_BRANDS.Tentatk, 1, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('スタジャンロゴマシ', exports.ALL_BRANDS.Zekko, 1, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('マウンテンダウン', exports.ALL_BRANDS.Inkline, 1, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('マウンテンオリーブ', exports.ALL_BRANDS.Inkline, 1, exports.ALL_ABILITIES.recon),
    new gear_1.default('タイシャツ', exports.ALL_BRANDS.SplashMob, 1, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('ガチガサネ', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('ガチホワイト', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.ninja_squid),
    new gear_1.default('レトロジャッジ', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('フェスT', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('ミスターベースボール', exports.ALL_BRANDS.Firefin, 1, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('ジップアップ カモ', exports.ALL_BRANDS.Firefin, 1, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('アーバンベスト ナイト', exports.ALL_BRANDS.Firefin, 1, exports.ALL_ABILITIES.cold_blooded),
    new gear_1.default('イカライダーBLACK', exports.ALL_BRANDS.Rockenberg, 1, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('イカライダーWHITE', exports.ALL_BRANDS.Rockenberg, 1, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('ヴィンテージチェック', exports.ALL_BRANDS.Rockenberg, 1, exports.ALL_ABILITIES.haunt),
    new gear_1.default('タコT', exports.ALL_BRANDS.Cuttlegear, 1, exports.ALL_ABILITIES.haunt),
    new gear_1.default('アーマージャケット　レプリカ', exports.ALL_BRANDS.Cuttlegear, 1, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('F-010', exports.ALL_BRANDS.Forge, 1, exports.ALL_ABILITIES.haunt),
    new gear_1.default('F-190', exports.ALL_BRANDS.Forge, 1, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('FCカラスミ', exports.ALL_BRANDS.Takoroka, 1, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('アオサドーレ', exports.ALL_BRANDS.Takoroka, 1, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('イカジャマイカ', exports.ALL_BRANDS.Skalop, 1, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('イカスカジャン', exports.ALL_BRANDS.Zekko, 1, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('イカスタンシャツ', exports.ALL_BRANDS.KrakOn, 1, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('イカセーラー ブルー', exports.ALL_BRANDS.Forge, 1, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('イカセーラー ホワイト', exports.ALL_BRANDS.Forge, 1, exports.ALL_ABILITIES.ink_saver_main),
    new gear_1.default('イカノボリベスト', exports.ALL_BRANDS.KrakOn, 1, exports.ALL_ABILITIES.cold_blooded),
    new gear_1.default('ウラスカジャン', exports.ALL_BRANDS.Zekko, 1, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('オータムネル', exports.ALL_BRANDS.Rockenberg, 1, exports.ALL_ABILITIES.ink_saver_main),
    new gear_1.default('カモフラパープル', exports.ALL_BRANDS.Takoroka, 1, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('クラーゲス528', exports.ALL_BRANDS.KrakOn, 1, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('ソウショクT', exports.ALL_BRANDS.Firefin, 1, exports.ALL_ABILITIES.ninja_squid),
    new gear_1.default('パールドットT', exports.ALL_BRANDS.Skalop, 1, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('バトロングホワイト', exports.ALL_BRANDS.SquidForce, 1, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('ピンポンポロ', exports.ALL_BRANDS.Zekko, 1, exports.ALL_ABILITIES.recon),
    new gear_1.default('フォレストダウン', exports.ALL_BRANDS.Inkline, 1, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('マルフグT', exports.ALL_BRANDS.Firefin, 1, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('ヤマビコボーダー', exports.ALL_BRANDS.Inkline, 1, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('リールロールスウェット', exports.ALL_BRANDS.Zekko, 1, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('シーホースHi ゾンビ', exports.ALL_BRANDS.Zink, 2, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('シーホースHi レッド', exports.ALL_BRANDS.Zink, 2, exports.ALL_ABILITIES.ink_saver_main),
    new gear_1.default('シーホース ホワイト', exports.ALL_BRANDS.Zink, 2, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('シーホースHi パープル', exports.ALL_BRANDS.Zink, 2, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('ブラックビーンズ', exports.ALL_BRANDS.Tentatk, 2, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('ウミウシパープル', exports.ALL_BRANDS.Tentatk, 2, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('ピンクビーンズ', exports.ALL_BRANDS.Tentatk, 2, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('シアンビーンズ', exports.ALL_BRANDS.Tentatk, 2, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('ウミウシイエロー', exports.ALL_BRANDS.Tentatk, 2, exports.ALL_ABILITIES.ink_resistance_up),
    new gear_1.default('グリッチョ オレンジ', exports.ALL_BRANDS.Zekko, 2, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('グリッチョ ブルー', exports.ALL_BRANDS.Zekko, 2, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('スリッポン レッド', exports.ALL_BRANDS.KrakOn, 2, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('キャンバス ホワイト', exports.ALL_BRANDS.KrakOn, 2, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('ブルーベリーコンフォート', exports.ALL_BRANDS.KrakOn, 2, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('オイスタークロッグ', exports.ALL_BRANDS.KrakOn, 2, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('キャンバス クマノミ', exports.ALL_BRANDS.KrakOn, 2, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('キャンバス バナナ', exports.ALL_BRANDS.KrakOn, 2, exports.ALL_ABILITIES.bomb_sniffer),
    new gear_1.default('キャンバスHi マッシュルーム', exports.ALL_BRANDS.KrakOn, 2, exports.ALL_ABILITIES.stealth_jump),
    new gear_1.default('キャンバスHi モロヘイヤ', exports.ALL_BRANDS.KrakOn, 2, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('スリッポン ブルー', exports.ALL_BRANDS.KrakOn, 2, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('レイニーアセロラ', exports.ALL_BRANDS.Inkline, 2, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('ベリベリレッド', exports.ALL_BRANDS.SplashMob, 2, exports.ALL_ABILITIES.ink_resistance_up),
    new gear_1.default('オレンジアローズ', exports.ALL_BRANDS.Takoroka, 2, exports.ALL_ABILITIES.ink_saver_main),
    new gear_1.default('ラバーソール ホワイト', exports.ALL_BRANDS.Rockenberg, 2, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('イカスミチップ', exports.ALL_BRANDS.Rockenberg, 2, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('シーホース イエロー', exports.ALL_BRANDS.Zink, 2, exports.ALL_ABILITIES.bomb_sniffer),
    new gear_1.default('シーホースHi ゴールド', exports.ALL_BRANDS.Zink, 2, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('シーホース ブラックレザー', exports.ALL_BRANDS.Zink, 2, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('スリッポン チドリ', exports.ALL_BRANDS.KrakOn, 2, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('チョコクロッグ', exports.ALL_BRANDS.KrakOn, 2, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('キャンバスHi トマト', exports.ALL_BRANDS.KrakOn, 2, exports.ALL_ABILITIES.ink_resistance_up),
    new gear_1.default('アケビコンフォート', exports.ALL_BRANDS.KrakOn, 2, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('レイニーモスグリーン', exports.ALL_BRANDS.Inkline, 2, exports.ALL_ABILITIES.stealth_jump),
    new gear_1.default('トレッキングカスタム', exports.ALL_BRANDS.Inkline, 2, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('トレッキングライト', exports.ALL_BRANDS.Inkline, 2, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('ホワイトアローズ', exports.ALL_BRANDS.Takoroka, 2, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('ラバーソール チェリー', exports.ALL_BRANDS.Rockenberg, 2, exports.ALL_ABILITIES.stealth_jump),
    new gear_1.default('ヌバックブーツ イエロー', exports.ALL_BRANDS.Rockenberg, 2, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('モトクロスブーツ', exports.ALL_BRANDS.Rockenberg, 2, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('ラバーソール ターコイズ', exports.ALL_BRANDS.Rockenberg, 2, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('ロッキンホワイト', exports.ALL_BRANDS.Rockenberg, 2, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('タコゾネスブーツ', exports.ALL_BRANDS.Cuttlegear, 2, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('ヒーローキックス レプリカ', exports.ALL_BRANDS.Cuttlegear, 2, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('パワードレッグス', exports.ALL_BRANDS.Amiibo, 2, exports.ALL_ABILITIES.ink_saver_main),
    new gear_1.default('サムライシューズ', exports.ALL_BRANDS.Amiibo, 2, exports.ALL_ABILITIES.special_duration_up),
    new gear_1.default('スクールローファー', exports.ALL_BRANDS.Amiibo, 2, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('タイショウのげた', exports.ALL_BRANDS.Famitsu, 2, exports.ALL_ABILITIES.run_speed_up),
    new gear_1.default('イカ娘シューズ', exports.ALL_BRANDS.TheSQUIDGIRL, 2, exports.ALL_ABILITIES.swim_speed_up),
    new gear_1.default('ウミウシレッド', exports.ALL_BRANDS.Tentatk, 2, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('グリッチョ グリーン 限定版', exports.ALL_BRANDS.Zekko, 2, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('トレッキングプロ', exports.ALL_BRANDS.Inkline, 2, exports.ALL_ABILITIES.bomb_sniffer),
    new gear_1.default('ベリベリホワイト', exports.ALL_BRANDS.SplashMob, 2, exports.ALL_ABILITIES.ink_saver_sub),
    new gear_1.default('ユデスパイカ', exports.ALL_BRANDS.Takoroka, 2, exports.ALL_ABILITIES.bomb_sniffer),
    new gear_1.default('クレイジーアローズ', exports.ALL_BRANDS.Takoroka, 2, exports.ALL_ABILITIES.stealth_jump),
    new gear_1.default('ヌバックブーツ レッド', exports.ALL_BRANDS.Rockenberg, 2, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('モトクロス ソリッドブルー', exports.ALL_BRANDS.Rockenberg, 2, exports.ALL_ABILITIES.ink_resistance_up),
    new gear_1.default('アーマーブーツ レプリカ', exports.ALL_BRANDS.Cuttlegear, 2, exports.ALL_ABILITIES.quick_respawn),
    new gear_1.default('アイスダウンブーツ', exports.ALL_BRANDS.Tentatk, 2, exports.ALL_ABILITIES.stealth_jump),
    new gear_1.default('イカヤキチップ', exports.ALL_BRANDS.Rockenberg, 2, exports.ALL_ABILITIES.defence_up),
    new gear_1.default('ウミウシブルー', exports.ALL_BRANDS.Tentatk, 2, exports.ALL_ABILITIES.special_charge_up),
    new gear_1.default('シャークモカシン', exports.ALL_BRANDS.SplashMob, 2, exports.ALL_ABILITIES.bomb_range_up),
    new gear_1.default('ジョーズモカシン', exports.ALL_BRANDS.SplashMob, 2, exports.ALL_ABILITIES.ink_recovery_up),
    new gear_1.default('ミルキーダウンブーツ', exports.ALL_BRANDS.Tentatk, 2, exports.ALL_ABILITIES.quick_super_jump),
    new gear_1.default('レアスパイカ', exports.ALL_BRANDS.Takoroka, 2, exports.ALL_ABILITIES.ink_resistance_up),
    new gear_1.default('レイニーシャボン', exports.ALL_BRANDS.Inkline, 2, exports.ALL_ABILITIES.damage_up),
    new gear_1.default('ロッキンイエロー', exports.ALL_BRANDS.Rockenberg, 2, exports.ALL_ABILITIES.special_saver),
    new gear_1.default('ロッキンチェリー', exports.ALL_BRANDS.Rockenberg, 2, exports.ALL_ABILITIES.bomb_sniffer),
];

},{"../domain/ability":2,"../domain/brand":4,"../domain/gear":5,"../domain/option":8}],13:[function(require,module,exports){
var gear_combination_1 = require("../domain/gear_combination");
var all_gears_1 = require("./all_gears");
var LocalGearRepository = (function () {
    function LocalGearRepository() {
    }
    LocalGearRepository.prototype.allGears = function () {
        return all_gears_1.ALL_GEARS;
    };
    LocalGearRepository.prototype.allGearCombinations = function () {
        var gearList = this.allGears();
        var headGears = gearList.filter(function (gear) { return gear.gearType === 0; });
        var clothings = gearList.filter(function (gear) { return gear.gearType === 1; });
        var shoes = gearList.filter(function (gear) { return gear.gearType === 2; });
        var combinations = [];
        for (var _i = 0; _i < headGears.length; _i++) {
            var headGear = headGears[_i];
            for (var _a = 0; _a < clothings.length; _a++) {
                var clothing = clothings[_a];
                for (var _b = 0; _b < shoes.length; _b++) {
                    var shoe = shoes[_b];
                    combinations.push(new gear_combination_1.default(headGear, clothing, shoe));
                }
            }
        }
        return combinations;
    };
    return LocalGearRepository;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LocalGearRepository;

},{"../domain/gear_combination":6,"./all_gears":12}],14:[function(require,module,exports){
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

},{"../domain/ability_option":3,"../domain/recommend_option":9}],15:[function(require,module,exports){
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

},{"../domain/ability_option":3,"../domain/recommend_option":9}],16:[function(require,module,exports){
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

},{}]},{},[1]);
