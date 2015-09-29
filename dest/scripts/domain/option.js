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
