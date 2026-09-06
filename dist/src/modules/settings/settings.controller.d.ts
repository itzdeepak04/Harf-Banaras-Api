import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    get(): Promise<import("../../shared/appresponse.shared").AppResponse<import("../../database/schemas").SettingsDocument>>;
    update(dto: {
        flatShippingFee?: number;
        freeShippingThreshold?: number;
        taxPercent?: number;
    }): Promise<import("../../shared/appresponse.shared").AppResponse<import("../../database/schemas").SettingsDocument>>;
}
