"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockStatus = exports.ProductStatus = void 0;
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["DRAFT"] = "draft";
    ProductStatus["PUBLISHED"] = "published";
    ProductStatus["ARCHIVED"] = "archived";
    ProductStatus["DISCONTINUED"] = "discontinued";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var StockStatus;
(function (StockStatus) {
    StockStatus["IN_STOCK"] = "in_stock";
    StockStatus["LOW_STOCK"] = "low_stock";
    StockStatus["OUT_OF_STOCK"] = "out_of_stock";
})(StockStatus || (exports.StockStatus = StockStatus = {}));
//# sourceMappingURL=product-status.enum.js.map