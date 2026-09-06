"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePriceWithTax = calculatePriceWithTax;
exports.calculateDiscount = calculateDiscount;
exports.calculateFinalPrice = calculateFinalPrice;
exports.paginate = paginate;
function calculatePriceWithTax(basePrice, taxPercentage) {
    return basePrice + basePrice * (taxPercentage / 100);
}
function calculateDiscount(basePrice, discountPercentage) {
    return basePrice * (discountPercentage / 100);
}
function calculateFinalPrice(basePrice, discountPercentage, taxPercentage) {
    const afterDiscount = basePrice - calculateDiscount(basePrice, discountPercentage);
    return calculatePriceWithTax(afterDiscount, taxPercentage);
}
function paginate(items, page = 1, limit = 10) {
    const total = items.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return {
        items: items.slice(startIndex, endIndex),
        total,
        page,
        limit,
    };
}
//# sourceMappingURL=index.js.map