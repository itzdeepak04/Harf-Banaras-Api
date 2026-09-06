import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../../database/schemas/order.schema';
import { Cart, CartDocument } from '../../database/schemas/cart.schema';
import { Product, ProductDocument } from '../../database/schemas/product.schema';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../../core/enums/order-status.enum';
import { MESSAGES } from '../../shared/messages.shared';
import { SettingsService } from '../settings/settings.service';
import { CouponsService } from '../coupons/coupons.service';
import { AuditLogService } from '../audit-log/audit-log.service';

const CANCELLABLE_STATUSES = [OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PACKED];

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly settingsService: SettingsService,
    private readonly couponsService: CouponsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  private genOrderNumber() {
    return `HB${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  // COD-only checkout. Payment gateway integration points are marked for later.
  async placeOrder(userId: string, shippingAddress: any, giftMessage = '', isGiftWrapped = false) {
    const cart = await this.cartModel.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const orderItems = [];
    const decrementedItems: { productId: any; quantity: number }[] = [];
    let orderCreated = false;
    let subtotal = 0;

    try {
      // Validate & decrement stock per item before creating the order
      for (const item of cart.items as any[]) {
      const product = item.product;
      if (!product) throw new NotFoundException(MESSAGES.PRODUCT.NOT_FOUND);

      const updated = await this.productModel.findOneAndUpdate(
        { _id: product._id, availableQuantity: { $gte: item.quantity } },
        { $inc: { availableQuantity: -item.quantity } },
        { new: true },
      );
      if (!updated) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Please update your cart.`,
        );
      }
      decrementedItems.push({ productId: product._id, quantity: item.quantity });

      const unitPrice = product.discountPrice > 0 ? product.discountPrice : product.sellingPrice;
      subtotal += unitPrice * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        image: product.images?.[0] || product.imagePaths?.[0] || 'product-image-unavailable',
        unitPrice,
        quantity: item.quantity,
      });
      }

    // Shipping fee / tax now come from the editable Settings collection
    // instead of being hardcoded here.
    const { shippingFee, tax } = await this.settingsService.calculateShippingAndTax(subtotal);

    // Apply the coupon attached to the cart (if any), re-validating it here
    // so a stale/expired code can't slip through from an earlier check.
    let discount = 0;
    let appliedCoupon: any = null;
    if (cart.couponCode) {
      try {
        const result = await this.couponsService.validate(cart.couponCode, subtotal);
        discount = result.discount;
        appliedCoupon = result.coupon;
      } catch {
        // Coupon became invalid between add-to-cart and checkout — silently
        // drop it rather than blocking the order.
        discount = 0;
      }
    }

    const total = subtotal - discount + shippingFee + tax;

    const order = await this.orderModel.create({
      orderNumber: this.genOrderNumber(),
      user: userId,
      items: orderItems,
      shippingAddress,
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PENDING,
      status: OrderStatus.PLACED,
      statusHistory: [{ status: OrderStatus.PLACED, at: new Date(), note: 'Order placed (COD)' }],
      giftMessage,
      isGiftWrapped,
    });
    orderCreated = true;

    if (appliedCoupon) {
      await this.couponsService.redeem(appliedCoupon._id.toString());
    }

    cart.items = [];
    cart.couponCode = '';
    await cart.save();

    await this.auditLogService.record(userId, 'ORDER_PLACED', 'Order', order._id.toString(), {
      total: order.total,
      itemCount: orderItems.length,
    });

      return order;
    } catch (error) {
      if (!orderCreated) {
        await Promise.all(
          decrementedItems.map(({ productId, quantity }) =>
            this.productModel.findByIdAndUpdate(productId, { $inc: { availableQuantity: quantity } }),
          ),
        );
      }
      throw error;
    }
  }

  async findMyOrders(userId: string) {
    return this.orderModel.find({ user: userId }).sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id).populate('items.product');
    if (!order) throw new NotFoundException(MESSAGES.ORDER.NOT_FOUND);
    return order;
  }

  async findAllForAdmin(status?: string) {
    const filter: any = {};
    if (status) filter.status = status;
    return this.orderModel.find(filter).sort({ createdAt: -1 });
  }

  async cancelOrder(id: string, userId: string, reason: string) {
    const order = await this.orderModel.findOne({ _id: id, user: userId });
    if (!order) throw new NotFoundException(MESSAGES.ORDER.NOT_FOUND);
    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      throw new BadRequestException(MESSAGES.ORDER.CANNOT_CANCEL);
    }

    // Restock items
    for (const item of order.items) {
      await this.productModel.findByIdAndUpdate(item.product, {
        $inc: { availableQuantity: item.quantity },
      });
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelReason = reason;
    order.statusHistory.push({ status: OrderStatus.CANCELLED, at: new Date(), note: reason });
    await order.save();

    await this.auditLogService.record(userId, 'ORDER_CANCELLED', 'Order', order._id.toString(), {
      reason,
    });

    return order;
  }

  // Admin: update order status (confirmed/packed/shipped/delivered etc.)
  async updateStatus(id: string, status: OrderStatus, note = '', performedBy?: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException(MESSAGES.ORDER.NOT_FOUND);
    const previousStatus = order.status;
    order.status = status;
    order.statusHistory.push({ status, at: new Date(), note });
    await order.save();

    if (performedBy) {
      await this.auditLogService.record(
        performedBy,
        'ORDER_STATUS_UPDATED',
        'Order',
        order._id.toString(),
        { from: previousStatus, to: status, note },
      );
    }

    return order;
  }
}
