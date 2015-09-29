import {OptionT} from "./option";
import RecommendOption from "./recommend_option";

interface RecommendOptionRepository {
    store(option: RecommendOption): void;
    get(): RecommendOption;
}
export default RecommendOptionRepository;
