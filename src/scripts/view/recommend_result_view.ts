import Gear from "../domain/gear";
import RecommendResult from "../domain/recommend_result";

declare var itemplate: any;
declare var IncrementalDOM: any;

export default class RecommendResultView {
    private container: HTMLElement;
    private renderFn: Function;

    mount(elem: HTMLElement, templateElem: HTMLElement): RecommendResultView {
        this.container = <HTMLElement>elem.querySelector('.result-container');
        this.renderFn = itemplate.compile(templateElem.innerHTML, IncrementalDOM);
        return this;
    }

    show(result: RecommendResult[]): void {
        const resultData: IRecommendCombination[] = result.map(r => {
            return {
                score: r.score,
                headGear: this.createGearData(r.headGear),
                clothing: this.createGearData(r.clothing),
                shoe: this.createGearData(r.shoe)
            };
        });
        this.update({
            error: null,
            result: resultData
        });
    }

    showNoOption(): void {
        this.update({
            error: "no-option",
            result: []
        });
    }

    private update(templateData: any): void {
        IncrementalDOM.patch(this.container, () => {
            this.renderFn(templateData, IncrementalDOM);
        });
    }

    private createGearData(gear: Gear): any {
        return {
            name: gear.gearName,
            mainAbilityId: gear.mainAbility.id,
            commonAbilityId: gear.brand.commonAbility.map(a => a.id).getOrElse(null),
            uncommonAbilityId: gear.brand.uncommonAbility.map(a => a.id).getOrElse(null),
        };
    }
}

interface IRecommendCombination {
    score: number;
    headGear: IRecommendGearData,
    clothing: IRecommendGearData,
    shoe: IRecommendGearData,
}

interface IRecommendGearData {
    name: string;
    mainAbilityId: string;
    commonAbilityId: string;
    uncommonAbilityId: string;
}
