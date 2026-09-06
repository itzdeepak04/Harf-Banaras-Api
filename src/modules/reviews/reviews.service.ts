import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from '../../database/schemas/review.schema';
import { Order, OrderDocument } from '../../database/schemas/order.schema';
import { OrderStatus } from '../../core/enums/order-status.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(userId: string, dto: { productId: string; orderId: string; rating: number; title?: string; comment?: string }) {
    const order = await this.orderModel.findOne({
      _id: dto.orderId,
      user: userId,
      status: OrderStatus.DELIVERED,
      'items.product': dto.productId,
    });
    if (!order) {
      throw new BadRequestException('You can only review products from a delivered order');
    }

    return this.reviewModel.create({
      product: dto.productId,
      user: userId,
      order: dto.orderId,
      rating: dto.rating,
      title: dto.title || '',
      comment: dto.comment || '',
      isVerifiedPurchase: true,
    });
  }

  async findForProduct(productId: string) {
    return this.reviewModel
      .find({ product: productId, moderationStatus: 'approved' })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
  }

  async moderate(id: string, status: 'approved' | 'rejected') {
    return this.reviewModel.findByIdAndUpdate(id, { moderationStatus: status }, { new: true });
  }
}
