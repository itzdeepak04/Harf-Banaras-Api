import { CouponType } from '../../../database/schemas/coupon.schema';
export declare class CreateCouponDto {
    code: string;
    type: CouponType;
    value: number;
    minOrderValue?: number;
    maxDiscount?: number;
    expiresAt: string;
    usageLimit?: number;
    description?: string;
}
export declare class UpdateCouponDto {
    value?: number;
    minOrderValue?: number;
    maxDiscount?: number;
    expiresAt?: string;
    isActive?: boolean;
    usageLimit?: number;
    description?: string;
}
export declare class ValidateCouponDto {
    code: string;
    cartSubtotal: number;
}
