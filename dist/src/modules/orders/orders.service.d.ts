import { Model } from 'mongoose';
import { Order, OrderDocument } from '../../database/schemas/order.schema';
import { CartDocument } from '../../database/schemas/cart.schema';
import { ProductDocument } from '../../database/schemas/product.schema';
import { OrderStatus } from '../../core/enums/order-status.enum';
import { SettingsService } from '../settings/settings.service';
import { CouponsService } from '../coupons/coupons.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { NotificationGateway } from '../notifications/notification.gateway';
export declare class OrdersService {
    private orderModel;
    private cartModel;
    private productModel;
    private readonly settingsService;
    private readonly couponsService;
    private readonly auditLogService;
    private readonly notificationGateway;
    constructor(orderModel: Model<OrderDocument>, cartModel: Model<CartDocument>, productModel: Model<ProductDocument>, settingsService: SettingsService, couponsService: CouponsService, auditLogService: AuditLogService, notificationGateway: NotificationGateway);
    private genOrderNumber;
    placeOrder(userId: string, shippingAddress: any, giftMessage?: string, isGiftWrapped?: boolean): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findMyOrders(userId: string): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAllForAdmin(status?: string): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    cancelOrder(id: string, userId: string, reason: string): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateStatus(id: string, status: OrderStatus, note?: string, performedBy?: string): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
