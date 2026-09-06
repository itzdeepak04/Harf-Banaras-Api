import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument, CouponType } from '../../database/schemas/coupon.schema';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<CouponDocument>,
  ) {}

  async create(dto: CreateCouponDto) {
    const existing = await this.couponModel.findOne({ code: dto.code.toUpperCase() });
    if (existing) throw new BadRequestException('A coupon with this code already exists');
    return this.couponModel.create({ ...dto, code: dto.code.toUpperCase() });
  }

  async findAll() {
    return this.couponModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const coupon = await this.couponModel.findById(id);
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async update(id: string, dto: UpdateCouponDto) {
    const coupon = await this.findOne(id);
    Object.assign(coupon, dto);
    await coupon.save();
    return coupon;
  }

  async remove(id: string) {
    await this.couponModel.findByIdAndDelete(id);
    return { deleted: true };
  }

  // Validates a coupon against an order/cart subtotal and returns the
  // rupee discount to apply. Does NOT mark it used — call `redeem` once
  // the order is actually placed, so an abandoned checkout doesn't burn usage.
  async validate(code: string, cartSubtotal: number): Promise<{ coupon: CouponDocument; discount: number }> {
    const coupon = await this.couponModel.findOne({ code: code.toUpperCase() });
    if (!coupon) throw new BadRequestException('Invalid coupon code');
    if (!coupon.isActive) throw new BadRequestException('This coupon is no longer active');
    if (coupon.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('This coupon has expired');
    }
    if (coupon.usageLimit > 0 && coupon.timesUsed >= coupon.usageLimit) {
      throw new BadRequestException('This coupon has reached its usage limit');
    }
    if (cartSubtotal < coupon.minOrderValue) {
      throw new BadRequestException(
        `This coupon requires a minimum order value of ₹${coupon.minOrderValue}`,
      );
    }

    let discount =
      coupon.type === CouponType.PERCENTAGE
        ? Math.round((cartSubtotal * coupon.value) / 100)
        : coupon.value;

    if (coupon.type === CouponType.PERCENTAGE && coupon.maxDiscount > 0) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
    discount = Math.min(discount, cartSubtotal);

    return { coupon, discount };
  }

  async redeem(couponId: string) {
    await this.couponModel.findByIdAndUpdate(couponId, { $inc: { timesUsed: 1 } });
  }
}
