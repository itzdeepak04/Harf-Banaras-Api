import { Document } from 'mongoose';
export type CouponDocument = Coupon & Document;
export declare enum CouponType {
    PERCENTAGE = "percentage",
    FLAT = "flat"
}
export declare class Coupon {
    code: string;
    type: CouponType;
    value: number;
    minOrderValue: number;
    maxDiscount: number;
    expiresAt: Date;
    isActive: boolean;
    usageLimit: number;
    timesUsed: number;
    description: string;
}
export declare const CouponSchema: import("mongoose").Schema<Coupon, import("mongoose").Model<Coupon, any, any, any, Document<unknown, any, Coupon, any, {}> & Coupon & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Coupon, Document<unknown, {}, import("mongoose").FlatRecord<Coupon>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Coupon> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
