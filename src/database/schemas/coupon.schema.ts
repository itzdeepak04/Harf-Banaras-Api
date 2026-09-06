import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CouponDocument = Coupon & Document;

export enum CouponType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
}

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  @Prop({ type: String, enum: CouponType, required: true })
  type: CouponType;

  // Percentage (0-100) or flat rupee amount, depending on `type`
  @Prop({ required: true })
  value: number;

  @Prop({ default: 0 })
  minOrderValue: number;

  // Optional cap on the discount a percentage coupon can give
  @Prop({ default: 0 })
  maxDiscount: number;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  // 0 = unlimited
  @Prop({ default: 0 })
  usageLimit: number;

  @Prop({ default: 0 })
  timesUsed: number;

  @Prop({ default: '' })
  description: string;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
