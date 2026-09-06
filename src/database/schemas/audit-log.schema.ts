import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  performedBy: Types.ObjectId;
  @Prop({ required: true }) action: string; // e.g. PRODUCT_PRICE_UPDATED
  @Prop({ required: true }) entityType: string; // Product, Order, User
  @Prop({ required: true }) entityId: string;
  @Prop({ type: Object, default: {} }) meta: Record<string, any>;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
