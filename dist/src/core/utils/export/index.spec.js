"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
describe('CSV utilities', () => {
    it('escapes commas, quotes, and newlines', () => {
        expect((0, index_1.convertToCSV)([{ sku: 'HB-1', reason: 'restock, received "today"' }])).toBe('sku,reason\nHB-1,"restock, received ""today"""');
    });
    it('round-trips quoted inventory rows', () => {
        const csv = 'sku,changeQuantity,reason\nHB-1,5,"New stock, checked"\nHB-2,-1,"Damaged"';
        expect((0, index_1.parseCSV)(csv)).toEqual([
            { sku: 'HB-1', changeQuantity: '5', reason: 'New stock, checked' },
            { sku: 'HB-2', changeQuantity: '-1', reason: 'Damaged' },
        ]);
    });
});
//# sourceMappingURL=index.spec.js.map