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
