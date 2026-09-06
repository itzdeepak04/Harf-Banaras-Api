import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '../../core/enums/order-status.enum';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) sku: string;
  @Prop({ required: true }) image: string;
  @Prop({ required: true }) unitPrice: number;
  @Prop({ required: true }) quantity: number;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
export class ShippingAddress {
  @Prop() fullName: string;
  @Prop() phone: string;
  @Prop() line1: string;
  @Prop() line2: string;
  @Prop() city: string;
  @Prop() state: string;
  @Prop() pincode: string;
}
export const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);

@Schema({ _id: false })
export class StatusHistoryEntry {
  @Prop({ type: String, enum: OrderStatus }) status: OrderStatus;
  @Prop({ default: Date.now }) at: Date;
  @Prop({ default: '' }) note: string;
}
export const StatusHistoryEntrySchema = SchemaFactory.createForClass(
  StatusHistoryEntry,
);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true }) orderNumber: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true }) items: OrderItem[];
  @Prop({ type: ShippingAddressSchema, required: true })
  shippingAddress: ShippingAddress;

  @Prop({ required: true }) subtotal: number;
  @Prop({ default: 0 }) discount: number;
  @Prop({ default: 0 }) shippingFee: number;
  @Prop({ default: 0 }) tax: number;
  @Prop({ required: true }) total: number;

  @Prop({ type: String, enum: PaymentMethod, default: PaymentMethod.COD })
  paymentMethod: PaymentMethod;
  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PLACED })
  status: OrderStatus;
  @Prop({ type: [StatusHistoryEntrySchema], default: [] })
  statusHistory: StatusHistoryEntry[];

  @Prop({ default: '' }) giftMessage: string;
  @Prop({ default: false }) isGiftWrapped: boolean;
  @Prop({ default: '' }) cancelReason: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
