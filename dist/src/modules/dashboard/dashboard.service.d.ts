import { Model } from 'mongoose';
import { OrderDocument } from '../../database/schemas/order.schema';
import { ProductDocument } from '../../database/schemas/product.schema';
import { UserDocument } from '../../database/schemas/user.schema';
import { StockMovement, StockMovementDocument } from '../../database/schemas/stock-movement.schema';
export declare class DashboardService {
    private orderModel;
    private productModel;
    private userModel;
    private stockMovementModel;
    constructor(orderModel: Model<OrderDocument>, productModel: Model<ProductDocument>, userModel: Model<UserDocument>, stockMovementModel: Model<StockMovementDocument>);
    adminSummary(): Promise<{
        totalSales: any;
        totalOrders: number;
        averageOrderValue: number;
        newCustomers30d: number;
        pendingOrders: number;
        pendingReturns: number;
        lowStockProducts: number;
        outOfStockProducts: number;
    }>;
    inventorySummary(): Promise<{
        totalActive: number;
        addedToday: number;
        lowStock: number;
        outOfStock: number;
        drafts: number;
        recentMovements: (import("mongoose").Document<unknown, {}, StockMovementDocument, {}, {}> & StockMovement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
}
