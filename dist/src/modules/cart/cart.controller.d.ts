import { CartService } from './cart.service';
import { AuthenticatedUser } from '../../core/interfaces/authenticated-user.interface';
import { ApplyCouponDto } from './dto/cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(user: AuthenticatedUser): Promise<import("../../shared/appresponse.shared").AppResponse<{
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
    }>>;
    addItem(user: AuthenticatedUser, dto: {
        productId: string;
        quantity: number;
    }): Promise<import("../../shared/appresponse.shared").AppResponse<{
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
    }>>;
    updateQuantity(user: AuthenticatedUser, productId: string, dto: {
        quantity: number;
    }): Promise<import("../../shared/appresponse.shared").AppResponse<{
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
    }>>;
    removeItem(user: AuthenticatedUser, productId: string): Promise<import("../../shared/appresponse.shared").AppResponse<{
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
    }>>;
    clearCart(user: AuthenticatedUser): Promise<import("../../shared/appresponse.shared").AppResponse<{
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
    }>>;
    applyCoupon(user: AuthenticatedUser, dto: ApplyCouponDto): Promise<import("../../shared/appresponse.shared").AppResponse<{
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
    }>>;
    removeCoupon(user: AuthenticatedUser): Promise<import("../../shared/appresponse.shared").AppResponse<{
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
    }>>;
}
