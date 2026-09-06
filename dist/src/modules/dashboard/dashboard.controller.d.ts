import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    adminSummary(): Promise<import("../../shared/appresponse.shared").AppResponse<{
        totalSales: any;
        totalOrders: number;
        averageOrderValue: number;
        newCustomers30d: number;
        pendingOrders: number;
        pendingReturns: number;
        lowStockProducts: number;
        outOfStockProducts: number;
    }>>;
    inventorySummary(): Promise<import("../../shared/appresponse.shared").AppResponse<{
        totalActive: number;
        addedToday: number;
        lowStock: number;
        outOfStock: number;
        drafts: number;
        recentMovements: (import("mongoose").Document<unknown, {}, import("../../database/schemas").StockMovementDocument, {}, {}> & import("../../database/schemas").StockMovement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>>;
}
