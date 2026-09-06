import { Document, Types } from 'mongoose';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../../core/enums/order-status.enum';
export type OrderDocument = Order & Document;
export declare class OrderItem {
    product: Types.ObjectId;
    name: string;
    sku: string;
    image: string;
    unitPrice: number;
    quantity: number;
}
export declare const OrderItemSchema: import("mongoose").Schema<OrderItem, import("mongoose").Model<OrderItem, any, any, any, Document<unknown, any, OrderItem, any, {}> & OrderItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrderItem, Document<unknown, {}, import("mongoose").FlatRecord<OrderItem>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<OrderItem> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class ShippingAddress {
    fullName: string;
    phone: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
}
export declare const ShippingAddressSchema: import("mongoose").Schema<ShippingAddress, import("mongoose").Model<ShippingAddress, any, any, any, Document<unknown, any, ShippingAddress, any, {}> & ShippingAddress & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ShippingAddress, Document<unknown, {}, import("mongoose").FlatRecord<ShippingAddress>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ShippingAddress> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class StatusHistoryEntry {
    status: OrderStatus;
    at: Date;
    note: string;
}
export declare const StatusHistoryEntrySchema: import("mongoose").Schema<StatusHistoryEntry, import("mongoose").Model<StatusHistoryEntry, any, any, any, Document<unknown, any, StatusHistoryEntry, any, {}> & StatusHistoryEntry & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StatusHistoryEntry, Document<unknown, {}, import("mongoose").FlatRecord<StatusHistoryEntry>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<StatusHistoryEntry> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Order {
    orderNumber: string;
    user: Types.ObjectId;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    subtotal: number;
    discount: number;
    shippingFee: number;
    tax: number;
    total: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    status: OrderStatus;
    statusHistory: StatusHistoryEntry[];
    giftMessage: string;
    isGiftWrapped: boolean;
    cancelReason: string;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any, {}> & Order & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Order> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
