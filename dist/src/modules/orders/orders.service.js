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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("../../database/schemas/order.schema");
const cart_schema_1 = require("../../database/schemas/cart.schema");
const product_schema_1 = require("../../database/schemas/product.schema");
const order_status_enum_1 = require("../../core/enums/order-status.enum");
const messages_shared_1 = require("../../shared/messages.shared");
const settings_service_1 = require("../settings/settings.service");
const coupons_service_1 = require("../coupons/coupons.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const CANCELLABLE_STATUSES = [order_status_enum_1.OrderStatus.PLACED, order_status_enum_1.OrderStatus.CONFIRMED, order_status_enum_1.OrderStatus.PACKED];
let OrdersService = class OrdersService {
    constructor(orderModel, cartModel, productModel, settingsService, couponsService, auditLogService) {
        this.orderModel = orderModel;
        this.cartModel = cartModel;
        this.productModel = productModel;
        this.settingsService = settingsService;
        this.couponsService = couponsService;
        this.auditLogService = auditLogService;
    }
    genOrderNumber() {
        return `HB${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
    async placeOrder(userId, shippingAddress, giftMessage = '', isGiftWrapped = false) {
        const cart = await this.cartModel.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const orderItems = [];
        const decrementedItems = [];
        let orderCreated = false;
        let subtotal = 0;
        try {
            for (const item of cart.items) {
                const product = item.product;
                if (!product)
                    throw new common_1.NotFoundException(messages_shared_1.MESSAGES.PRODUCT.NOT_FOUND);
                const updated = await this.productModel.findOneAndUpdate({ _id: product._id, availableQuantity: { $gte: item.quantity } }, { $inc: { availableQuantity: -item.quantity } }, { new: true });
                if (!updated) {
                    throw new common_1.BadRequestException(`Insufficient stock for ${product.name}. Please update your cart.`);
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
            const { shippingFee, tax } = await this.settingsService.calculateShippingAndTax(subtotal);
            let discount = 0;
            let appliedCoupon = null;
            if (cart.couponCode) {
                try {
                    const result = await this.couponsService.validate(cart.couponCode, subtotal);
                    discount = result.discount;
                    appliedCoupon = result.coupon;
                }
                catch {
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
                paymentMethod: order_status_enum_1.PaymentMethod.COD,
                paymentStatus: order_status_enum_1.PaymentStatus.PENDING,
                status: order_status_enum_1.OrderStatus.PLACED,
                statusHistory: [{ status: order_status_enum_1.OrderStatus.PLACED, at: new Date(), note: 'Order placed (COD)' }],
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
        }
        catch (error) {
            if (!orderCreated) {
                await Promise.all(decrementedItems.map(({ productId, quantity }) => this.productModel.findByIdAndUpdate(productId, { $inc: { availableQuantity: quantity } })));
            }
            throw error;
        }
    }
    async findMyOrders(userId) {
        return this.orderModel.find({ user: userId }).sort({ createdAt: -1 });
    }
    async findOne(id) {
        const order = await this.orderModel.findById(id).populate('items.product');
        if (!order)
            throw new common_1.NotFoundException(messages_shared_1.MESSAGES.ORDER.NOT_FOUND);
        return order;
    }
    async findAllForAdmin(status) {
        const filter = {};
        if (status)
            filter.status = status;
        return this.orderModel.find(filter).sort({ createdAt: -1 });
    }
    async cancelOrder(id, userId, reason) {
        const order = await this.orderModel.findOne({ _id: id, user: userId });
        if (!order)
            throw new common_1.NotFoundException(messages_shared_1.MESSAGES.ORDER.NOT_FOUND);
        if (!CANCELLABLE_STATUSES.includes(order.status)) {
            throw new common_1.BadRequestException(messages_shared_1.MESSAGES.ORDER.CANNOT_CANCEL);
        }
        for (const item of order.items) {
            await this.productModel.findByIdAndUpdate(item.product, {
                $inc: { availableQuantity: item.quantity },
            });
        }
        order.status = order_status_enum_1.OrderStatus.CANCELLED;
        order.cancelReason = reason;
        order.statusHistory.push({ status: order_status_enum_1.OrderStatus.CANCELLED, at: new Date(), note: reason });
        await order.save();
        await this.auditLogService.record(userId, 'ORDER_CANCELLED', 'Order', order._id.toString(), {
            reason,
        });
        return order;
    }
    async updateStatus(id, status, note = '', performedBy) {
        const order = await this.orderModel.findById(id);
        if (!order)
            throw new common_1.NotFoundException(messages_shared_1.MESSAGES.ORDER.NOT_FOUND);
        const previousStatus = order.status;
        order.status = status;
        order.statusHistory.push({ status, at: new Date(), note });
        await order.save();
        if (performedBy) {
            await this.auditLogService.record(performedBy, 'ORDER_STATUS_UPDATED', 'Order', order._id.toString(), { from: previousStatus, to: status, note });
        }
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        settings_service_1.SettingsService,
        coupons_service_1.CouponsService,
        audit_log_service_1.AuditLogService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map