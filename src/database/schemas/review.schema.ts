import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  order: Types.ObjectId; // proof of purchase

  @Prop({ required: true, min: 1, max: 5 }) rating: number;
  @Prop({ default: '' }) title: string;
  @Prop({ default: '' }) comment: string;
  @Prop({ default: true }) isVerifiedPurchase: boolean;
  @Prop({ default: 'approved', enum: ['pending', 'approved', 'rejected'] })
  moderationStatus: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ product: 1, user: 1, order: 1 }, { unique: true });
