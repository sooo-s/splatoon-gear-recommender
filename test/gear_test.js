var assert = require("assert");
var OptionT = require("../dest/scripts/domain/option");
var Optional = OptionT.Optional;
var Ability = require("../dest/scripts/domain/ability").default;
var Brand = require("../dest/scripts/domain/brand").default;
var Gear = require("../dest/scripts/domain/gear.js").default;
var GearType = require("../dest/scripts/domain/gear_type").default;

describe('Gear', function() {
    //name: string, brand: Brand, type: GearType, mainAbility: Ability
    var abilityA = new Ability("a", "A");
    var abilityB = new Ability("b", "B");
    var abilityC = new Ability("c", "C");
    var abilityD = new Ability("d", "D");
    var brandA = new Brand("brandAID", "brandAName", Optional(abilityA), Optional(abilityB));

    describe('#hasAbility', function() {
        it('ギアのメインギアパワーを指定されたときに真を返す', function() {
            var gear = new Gear('name', brandA, GearType.HeadGear, abilityC);
            assert(gear.hasAbility(abilityC));
        });
        it('ブランドのつきやすいギアパワーを指定されたときに真を返す', function() {
            var gear = new Gear('name', brandA, GearType.HeadGear, abilityC);
            assert(gear.hasAbility(abilityA));
        });
        it('ブランドのつきにくいギアパワーを指定されたときに偽を返す', function() {
            var gear = new Gear('name', brandA, GearType.HeadGear, abilityC);
            assert(gear.hasAbility(abilityB) === false);
        });
        it('ギアのメインギアパワーとブランドにないギアパワーを指定されたときに偽を返す', function() {
            var gear = new Gear('name', brandA, GearType.HeadGear, abilityC);
            assert(gear.hasAbility(abilityD) === false);
        });
    });
});
