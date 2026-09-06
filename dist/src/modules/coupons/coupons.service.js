"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const coupon_schema_1 = require("../../database/schemas/coupon.schema");
let CouponsService = class CouponsService {
    constructor(couponModel) {
        this.couponModel = couponModel;
    }
    async create(dto) {
        const existing = await this.couponModel.findOne({ code: dto.code.toUpperCase() });
        if (existing)
            throw new common_1.BadRequestException('A coupon with this code already exists');
        return this.couponModel.create({ ...dto, code: dto.code.toUpperCase() });
    }
    async findAll() {
        return this.couponModel.find().sort({ createdAt: -1 });
    }
    async findOne(id) {
        const coupon = await this.couponModel.findById(id);
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        return coupon;
    }
    async update(id, dto) {
        const coupon = await this.findOne(id);
        Object.assign(coupon, dto);
        await coupon.save();
        return coupon;
    }
    async remove(id) {
        await this.couponModel.findByIdAndDelete(id);
        return { deleted: true };
    }
    async validate(code, cartSubtotal) {
        const coupon = await this.couponModel.findOne({ code: code.toUpperCase() });
        if (!coupon)
            throw new common_1.BadRequestException('Invalid coupon code');
        if (!coupon.isActive)
            throw new common_1.BadRequestException('This coupon is no longer active');
        if (coupon.expiresAt.getTime() < Date.now()) {
            throw new common_1.BadRequestException('This coupon has expired');
        }
        if (coupon.usageLimit > 0 && coupon.timesUsed >= coupon.usageLimit) {
            throw new common_1.BadRequestException('This coupon has reached its usage limit');
        }
        if (cartSubtotal < coupon.minOrderValue) {
            throw new common_1.BadRequestException(`This coupon requires a minimum order value of ₹${coupon.minOrderValue}`);
        }
        let discount = coupon.type === coupon_schema_1.CouponType.PERCENTAGE
            ? Math.round((cartSubtotal * coupon.value) / 100)
            : coupon.value;
        if (coupon.type === coupon_schema_1.CouponType.PERCENTAGE && coupon.maxDiscount > 0) {
            discount = Math.min(discount, coupon.maxDiscount);
        }
        discount = Math.min(discount, cartSubtotal);
        return { coupon, discount };
    }
    async redeem(couponId) {
        await this.couponModel.findByIdAndUpdate(couponId, { $inc: { timesUsed: 1 } });
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(coupon_schema_1.Coupon.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map