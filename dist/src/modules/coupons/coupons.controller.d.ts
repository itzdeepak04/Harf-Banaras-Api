import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupon.dto';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    create(dto: CreateCouponDto): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").CouponDocument, {}, {}> & import("../../database/schemas").Coupon & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    findAll(): Promise<import("../../shared/appresponse.shared").AppResponse<(import("mongoose").Document<unknown, {}, import("../../database/schemas").CouponDocument, {}, {}> & import("../../database/schemas").Coupon & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>>;
    update(id: string, dto: UpdateCouponDto): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").CouponDocument, {}, {}> & import("../../database/schemas").Coupon & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    remove(id: string): Promise<import("../../shared/appresponse.shared").AppResponse<any>>;
    validate(dto: ValidateCouponDto): Promise<import("../../shared/appresponse.shared").AppResponse<{
        discount: number;
    }>>;
}
