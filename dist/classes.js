"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Centroid = exports.Vector2 = void 0;
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.distanceTo = function (vec) {
        return Math.sqrt(Math.pow(vec.x - this.x, 2) + Math.pow(vec.y - this.y, 2));
    };
    Vector2.prototype.add = function (vec) {
        this.x += vec.x;
        this.y += vec.y;
    };
    Vector2.prototype.divideScalar = function (scalar) {
        this.x /= scalar;
        this.y /= scalar;
    };
    Vector2.prototype.copy = function (vec) {
        this.x = vec.x;
        this.y = vec.y;
    };
    return Vector2;
}());
exports.Vector2 = Vector2;
var Centroid = /** @class */ (function (_super) {
    __extends(Centroid, _super);
    function Centroid(vec) {
        var _this = _super.call(this, vec.x, vec.y) || this;
        _this.cluster = [];
        _this.oldCluster = [];
        return _this;
    }
    Centroid.prototype.hasChanged = function () {
        for (var i = 0; i < this.cluster.length; i++) {
            if (!this.oldCluster.includes(this.cluster[i]))
                return true;
        }
        return false;
    };
    Centroid.prototype.resetCluster = function () {
        this.oldCluster = this.cluster;
        this.cluster = [];
    };
    return Centroid;
}(Vector2));
exports.Centroid = Centroid;
