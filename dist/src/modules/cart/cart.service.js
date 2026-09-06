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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cart_schema_1 = require("../../database/schemas/cart.schema");
const product_schema_1 = require("../../database/schemas/product.schema");
const messages_shared_1 = require("../../shared/messages.shared");
const coupons_service_1 = require("../coupons/coupons.service");
let CartService = class CartService {
    constructor(cartModel, productModel, couponsService) {
        this.cartModel = cartModel;
        this.productModel = productModel;
        this.couponsService = couponsService;
    }
    async getOrCreateCart(userId) {
        let cart = await this.cartModel.findOne({ user: userId });
        if (!cart)
            cart = await this.cartModel.create({ user: userId, items: [] });
        return cart;
    }
    async getCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        const populated = await cart.populate('items.product');
        return this.buildCartSummary(populated);
    }
    async buildCartSummary(cart) {
        let subtotal = 0;
        const items = cart.items.map((item) => {
            const product = item.product;
            const price = product?.discountPrice > 0 ? product.discountPrice : product?.sellingPrice;
            const lineTotal = price * item.quantity;
            subtotal += lineTotal;
            return {
                product,
                quantity: item.quantity,
                unitPrice: price,
                lineTotal,
            };
        });
        let discount = 0;
        let couponError = null;
        if (cart.couponCode) {
            try {
                const result = await this.couponsService.validate(cart.couponCode, subtotal);
                discount = result.discount;
            }
            catch (e) {
                couponError = e.message;
            }
        }
        return {
            items,
            subtotal,
            itemCount: items.reduce((s, i) => s + i.quantity, 0),
            couponCode: cart.couponCode || null,
            discount,
            couponError,
            total: subtotal - discount,
        };
    }
    async applyCoupon(userId, code) {
        const cart = await this.getOrCreateCart(userId);
        const populated = await cart.populate('items.product');
        const subtotal = populated.items.reduce((s, i) => {
            const p = i.product;
            const price = p?.discountPrice > 0 ? p.discountPrice : p?.sellingPrice;
            return s + price * i.quantity;
        }, 0);
        await this.couponsService.validate(code, subtotal);
        cart.couponCode = code.toUpperCase();
        await cart.save();
        return this.getCart(userId);
    }
    async removeCoupon(userId) {
        const cart = await this.getOrCreateCart(userId);
        cart.couponCode = '';
        await cart.save();
        return this.getCart(userId);
    }
    async addItem(userId, productId, quantity) {
        const product = await this.productModel.findById(productId);
        if (!product)
            throw new common_1.NotFoundException(messages_shared_1.MESSAGES.PRODUCT.NOT_FOUND);
        if (product.availableQuantity < quantity) {
            throw new common_1.BadRequestException(messages_shared_1.MESSAGES.CART.INSUFFICIENT_STOCK);
        }
        const cart = await this.getOrCreateCart(userId);
        const existing = cart.items.find((i) => i.product.toString() === productId);
        if (existing) {
            const newQty = existing.quantity + quantity;
            if (newQty > product.availableQuantity) {
                throw new common_1.BadRequestException(messages_shared_1.MESSAGES.CART.INSUFFICIENT_STOCK);
            }
            existing.quantity = newQty;
        }
        else {
            cart.items.push({
                product: product._id,
                quantity,
                priceAtAdd: product.discountPrice > 0 ? product.discountPrice : product.sellingPrice,
            });
        }
        await cart.save();
        return this.getCart(userId);
    }
    async updateQuantity(userId, productId, quantity) {
        if (quantity <= 0)
            return this.removeItem(userId, productId);
        const product = await this.productModel.findById(productId);
        if (!product)
            throw new common_1.NotFoundException(messages_shared_1.MESSAGES.PRODUCT.NOT_FOUND);
        if (quantity > product.availableQuantity) {
            throw new common_1.BadRequestException(messages_shared_1.MESSAGES.CART.INSUFFICIENT_STOCK);
        }
        const cart = await this.getOrCreateCart(userId);
        const item = cart.items.find((i) => i.product.toString() === productId);
        if (!item)
            throw new common_1.NotFoundException('Item not in cart');
        item.quantity = quantity;
        await cart.save();
        return this.getCart(userId);
    }
    async removeItem(userId, productId) {
        const cart = await this.getOrCreateCart(userId);
        cart.items = cart.items.filter((i) => i.product.toString() !== productId);
        await cart.save();
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        cart.items = [];
        await cart.save();
        return this.getCart(userId);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        coupons_service_1.CouponsService])
], CartService);
//# sourceMappingURL=cart.service.js.map