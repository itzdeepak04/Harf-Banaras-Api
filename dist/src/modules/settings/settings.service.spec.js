"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_service_1 = require("./settings.service");
describe('SettingsService', () => {
    it('calculates free shipping and tax from stored settings', async () => {
        const settings = {
            flatShippingFee: 120,
            freeShippingThreshold: 2000,
            taxPercent: 5,
        };
        const model = {
            findOne: jest.fn().mockResolvedValue(settings),
        };
        const service = new settings_service_1.SettingsService(model);
        await expect(service.calculateShippingAndTax(2500)).resolves.toEqual({
            shippingFee: 0,
            tax: 125,
        });
        await expect(service.calculateShippingAndTax(1000)).resolves.toEqual({
            shippingFee: 120,
            tax: 50,
        });
    });
});
//# sourceMappingURL=settings.service.spec.js.map