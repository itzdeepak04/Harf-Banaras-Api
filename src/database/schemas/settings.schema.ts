import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingsDocument = Settings & Document;

// Singleton document (one row) holding editable shipping/tax config.
@Schema({ timestamps: true })
export class Settings {
  @Prop({ default: 99 })
  flatShippingFee: number;

  @Prop({ default: 2000 })
  freeShippingThreshold: number;

  @Prop({ default: 0 })
  taxPercent: number;

  @Prop({ default: 'singleton', unique: true })
  key: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
