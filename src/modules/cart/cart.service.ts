import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from '../../database/schemas/cart.schema';
import { Product, ProductDocument } from '../../database/schemas/product.schema';
import { CartAbstract } from './cart.abstract';
import { MESSAGES } from '../../shared/messages.shared';
import { CouponsService } from '../coupons/coupons.service';

@Injectable()
export class CartService implements CartAbstract {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly couponsService: CouponsService,
  ) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) cart = await this.cartModel.create({ user: userId, items: [] });
    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    const populated = await cart.populate('items.product');
    return this.buildCartSummary(populated);
  }

  private async buildCartSummary(cart: CartDocument) {
    let subtotal = 0;
    const items = (cart.items as any[]).map((item) => {
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
    let couponError: string | null = null;
    if (cart.couponCode) {
      try {
        const result = await this.couponsService.validate(cart.couponCode, subtotal);
        discount = result.discount;
      } catch (e: any) {
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

  // Attaches a coupon code to the cart; actual validation happens whenever
  // the cart is read (buildCartSummary) and again at checkout (orders.service).
  async applyCoupon(userId: string, code: string) {
    const cart = await this.getOrCreateCart(userId);
    const populated = await cart.populate('items.product');
    const subtotal = (populated.items as any[]).reduce((s, i) => {
      const p = i.product;
      const price = p?.discountPrice > 0 ? p.discountPrice : p?.sellingPrice;
      return s + price * i.quantity;
    }, 0);

    // Throws if invalid — surfaces a clear error to the frontend immediately
    // instead of silently attaching a bad code.
    await this.couponsService.validate(code, subtotal);

    cart.couponCode = code.toUpperCase();
    await cart.save();
    return this.getCart(userId);
  }

  async removeCoupon(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    cart.couponCode = '';
    await cart.save();
    return this.getCart(userId);
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException(MESSAGES.PRODUCT.NOT_FOUND);
    if (product.availableQuantity < quantity) {
      throw new BadRequestException(MESSAGES.CART.INSUFFICIENT_STOCK);
    }

    const cart = await this.getOrCreateCart(userId);
    const existing = cart.items.find((i) => i.product.toString() === productId);

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.availableQuantity) {
        throw new BadRequestException(MESSAGES.CART.INSUFFICIENT_STOCK);
      }
      existing.quantity = newQty;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        priceAtAdd: product.discountPrice > 0 ? product.discountPrice : product.sellingPrice,
      } as any);
    }
    await cart.save();
    return this.getCart(userId);
  }

  // Powers the "- 1 +" stepper. quantity=0 removes the item.
  async updateQuantity(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) return this.removeItem(userId, productId);

    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException(MESSAGES.PRODUCT.NOT_FOUND);
    if (quantity > product.availableQuantity) {
      throw new BadRequestException(MESSAGES.CART.INSUFFICIENT_STOCK);
    }

    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) throw new NotFoundException('Item not in cart');
    item.quantity = quantity;
    await cart.save();
    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = cart.items.filter((i) => i.product.toString() !== productId) as any;
    await cart.save();
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = [];
    await cart.save();
    return this.getCart(userId);
  }
}
