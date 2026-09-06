import { Model } from 'mongoose';
import { CartDocument } from '../../database/schemas/cart.schema';
import { ProductDocument } from '../../database/schemas/product.schema';
import { CartAbstract } from './cart.abstract';
import { CouponsService } from '../coupons/coupons.service';
export declare class CartService implements CartAbstract {
    private cartModel;
    private productModel;
    private readonly couponsService;
    constructor(cartModel: Model<CartDocument>, productModel: Model<ProductDocument>, couponsService: CouponsService);
    private getOrCreateCart;
    getCart(userId: string): Promise<{
        items: {
            product: any;
            quantity: any;
            unitPrice: any;
            lineTotal: number;
        }[];
        subtotal: number;
        itemCount: any;
        couponCode: string;
        discount: number;
        couponError: string;
        total: number;
    }>;
    private buildCartSummary;
    applyCoupon(userId: string, code: string): Promise<{
        items: {
            product: any;
            quantity: any;
            unitPrice: any;
            lineTotal: number;
        }[];
        subtotal: number;
        itemCount: any;
        couponCode: string;
        discount: number;
        couponError: string;
        total: number;
    }>;
    removeCoupon(userId: string): Promise<{
        items: {
            product: any;
            quantity: any;
            unitPrice: any;
            lineTotal: number;
        }[];
        subtotal: number;
        itemCount: any;
        couponCode: string;
        discount: number;
        couponError: string;
        total: number;
    }>;
    addItem(userId: string, productId: string, quantity: number): Promise<{
        items: {
            product: any;
            quantity: any;
            unitPrice: any;
            lineTotal: number;
        }[];
        subtotal: number;
        itemCount: any;
        couponCode: string;
        discount: number;
        couponError: string;
        total: number;
    }>;
    updateQuantity(userId: string, productId: string, quantity: number): Promise<{
        items: {
            product: any;
            quantity: any;
            unitPrice: any;
            lineTotal: number;
        }[];
        subtotal: number;
        itemCount: any;
        couponCode: string;
        discount: number;
        couponError: string;
        total: number;
    }>;
    removeItem(userId: string, productId: string): Promise<{
        items: {
            product: any;
            quantity: any;
            unitPrice: any;
            lineTotal: number;
        }[];
        subtotal: number;
        itemCount: any;
        couponCode: string;
        discount: number;
        couponError: string;
        total: number;
    }>;
    clearCart(userId: string): Promise<{
        items: {
            product: any;
            quantity: any;
            unitPrice: any;
            lineTotal: number;
        }[];
        subtotal: number;
        itemCount: any;
        couponCode: string;
        discount: number;
        couponError: string;
        total: number;
    }>;
}
