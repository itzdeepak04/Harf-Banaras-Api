import { Model } from 'mongoose';
import { Coupon, CouponDocument } from '../../database/schemas/coupon.schema';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
export declare class CouponsService {
    private couponModel;
    constructor(couponModel: Model<CouponDocument>);
    create(dto: CreateCouponDto): Promise<import("mongoose").Document<unknown, {}, CouponDocument, {}, {}> & Coupon & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, CouponDocument, {}, {}> & Coupon & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, CouponDocument, {}, {}> & Coupon & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, dto: UpdateCouponDto): Promise<import("mongoose").Document<unknown, {}, CouponDocument, {}, {}> & Coupon & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
    validate(code: string, cartSubtotal: number): Promise<{
        coupon: CouponDocument;
        discount: number;
    }>;
    redeem(couponId: string): Promise<void>;
}
