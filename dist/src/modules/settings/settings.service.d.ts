import { Model } from 'mongoose';
import { SettingsDocument } from '../../database/schemas/settings.schema';
export declare class SettingsService {
    private settingsModel;
    constructor(settingsModel: Model<SettingsDocument>);
    get(): Promise<SettingsDocument>;
    update(dto: {
        flatShippingFee?: number;
        freeShippingThreshold?: number;
        taxPercent?: number;
    }): Promise<SettingsDocument>;
    calculateShippingAndTax(subtotal: number): Promise<{
        shippingFee: number;
        tax: number;
    }>;
}
