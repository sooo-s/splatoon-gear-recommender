var assert = require("assert");
var OptionT = require("../dest/scripts/domain/option");
var Optional = OptionT.Optional;
var Ability = require("../dest/scripts/domain/ability").default;
var Brand = require("../dest/scripts/domain/brand").default;

describe("Brand", function() {
    var abilityA = new Ability("a", "A");
    var abilityB = new Ability("b", "B");
    var abilityC = new Ability("c", "C");
    var abilityD = new Ability("d", "D");

    it('#hasCommonAbility', function() {
        var brand = new Brand("id", "name", Optional(abilityA), Optional(abilityB));
        assert(brand.hasCommonAbility(abilityA));
        assert(brand.hasCommonAbility(abilityB) === false);
        assert(brand.hasCommonAbility(abilityC) === false);
    });

    it('#hasUncommonAbility', function() {
        var brand = new Brand("id", "name", Optional(abilityA), Optional(abilityB));
        assert(brand.hasUncommonAbility(abilityB));
        assert(brand.hasUncommonAbility(abilityA) === false);
        assert(brand.hasUncommonAbility(abilityC) === false);
    });
});
