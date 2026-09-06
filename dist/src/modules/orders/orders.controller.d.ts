import { OrdersService } from './orders.service';
import { AuthenticatedUser } from '../../core/interfaces/authenticated-user.interface';
import { OrderStatus } from '../../core/enums/order-status.enum';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    placeOrder(user: AuthenticatedUser, dto: {
        shippingAddress: any;
        giftMessage?: string;
        isGiftWrapped?: boolean;
    }): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").OrderDocument, {}, {}> & import("../../database/schemas").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    myOrders(user: AuthenticatedUser): Promise<import("../../shared/appresponse.shared").AppResponse<(import("mongoose").Document<unknown, {}, import("../../database/schemas").OrderDocument, {}, {}> & import("../../database/schemas").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>>;
    findOne(id: string): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").OrderDocument, {}, {}> & import("../../database/schemas").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    cancel(user: AuthenticatedUser, id: string, dto: {
        reason: string;
    }): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").OrderDocument, {}, {}> & import("../../database/schemas").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    findAll(status?: string): Promise<import("../../shared/appresponse.shared").AppResponse<(import("mongoose").Document<unknown, {}, import("../../database/schemas").OrderDocument, {}, {}> & import("../../database/schemas").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>>;
    updateStatus(user: AuthenticatedUser, id: string, dto: {
        status: OrderStatus;
        note?: string;
    }): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").OrderDocument, {}, {}> & import("../../database/schemas").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
}
