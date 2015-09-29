import {OptionT} from "./option";
import Ability from "./ability";

/**
 * ブランド
 */
export default class Brand {
    constructor(public id: string, public name: string, public commonAbility: OptionT<Ability>, public uncommonAbility: OptionT<Ability>) {
    }

    hasCommonAbility(ability: Ability): boolean {
        return this.commonAbility.exists(a => a.id === ability.id);
    }

    hasUncommonAbility(ability: Ability): boolean {
        return this.uncommonAbility.exists(a => a.id === ability.id);
    }

    /**
     * 同じブランドかどうかを比較する
     */
    equalsTo(brand: any) {
        return brand instanceof Brand && brand.id === this.id;
    }
}
