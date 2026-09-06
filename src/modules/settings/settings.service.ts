import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from '../../database/schemas/settings.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
  ) {}

  // Ensures exactly one settings row always exists, created lazily on first read.
  async get(): Promise<SettingsDocument> {
    let settings = await this.settingsModel.findOne({ key: 'singleton' });
    if (!settings) {
      settings = await this.settingsModel.create({ key: 'singleton' });
    }
    return settings;
  }

  async update(dto: {
    flatShippingFee?: number;
    freeShippingThreshold?: number;
    taxPercent?: number;
  }): Promise<SettingsDocument> {
    const settings = await this.get();
    Object.assign(settings, dto);
    await settings.save();
    return settings;
  }

  // Used by OrdersService — keeps shipping/tax logic in one editable place
  // instead of hardcoded numbers in orders.service.ts.
  async calculateShippingAndTax(subtotal: number) {
    const settings = await this.get();
    const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : settings.flatShippingFee;
    const tax = Math.round((subtotal * settings.taxPercent) / 100);
    return { shippingFee, tax };
  }
}
