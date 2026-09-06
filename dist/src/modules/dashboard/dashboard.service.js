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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("../../database/schemas/order.schema");
const product_schema_1 = require("../../database/schemas/product.schema");
const user_schema_1 = require("../../database/schemas/user.schema");
const stock_movement_schema_1 = require("../../database/schemas/stock-movement.schema");
const order_status_enum_1 = require("../../core/enums/order-status.enum");
const product_status_enum_1 = require("../../core/enums/product-status.enum");
let DashboardService = class DashboardService {
    constructor(orderModel, productModel, userModel, stockMovementModel) {
        this.orderModel = orderModel;
        this.productModel = productModel;
        this.userModel = userModel;
        this.stockMovementModel = stockMovementModel;
    }
    async adminSummary() {
        const [totalOrders, pendingOrders, pendingReturns, lowStock, outOfStock, revenueAgg, newCustomers30d,] = await Promise.all([
            this.orderModel.countDocuments(),
            this.orderModel.countDocuments({ status: order_status_enum_1.OrderStatus.PLACED }),
            this.orderModel.countDocuments({ status: order_status_enum_1.OrderStatus.RETURN_REQUESTED }),
            this.productModel.countDocuments({ stockStatus: product_status_enum_1.StockStatus.LOW_STOCK }),
            this.productModel.countDocuments({ stockStatus: product_status_enum_1.StockStatus.OUT_OF_STOCK }),
            this.orderModel.aggregate([
                { $match: { status: { $ne: order_status_enum_1.OrderStatus.CANCELLED } } },
                { $group: { _id: null, totalSales: { $sum: '$total' }, count: { $sum: 1 } } },
            ]),
            this.userModel.countDocuments({
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            }),
        ]);
        const totalSales = revenueAgg[0]?.totalSales || 0;
        const orderCountForAvg = revenueAgg[0]?.count || 0;
        const averageOrderValue = orderCountForAvg ? totalSales / orderCountForAvg : 0;
        return {
            totalSales,
            totalOrders,
            averageOrderValue,
            newCustomers30d,
            pendingOrders,
            pendingReturns,
            lowStockProducts: lowStock,
            outOfStockProducts: outOfStock,
        };
    }
    async inventorySummary() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [totalActive, addedToday, lowStock, outOfStock, drafts, recentMovements,] = await Promise.all([
            this.productModel.countDocuments({ status: product_status_enum_1.ProductStatus.PUBLISHED }),
            this.productModel.countDocuments({ createdAt: { $gte: today } }),
            this.productModel.countDocuments({ stockStatus: product_status_enum_1.StockStatus.LOW_STOCK }),
            this.productModel.countDocuments({ stockStatus: product_status_enum_1.StockStatus.OUT_OF_STOCK }),
            this.productModel.countDocuments({ status: product_status_enum_1.ProductStatus.DRAFT }),
            this.stockMovementModel.find().sort({ createdAt: -1 }).limit(20).populate('product performedBy'),
        ]);
        return {
            totalActive,
            addedToday,
            lowStock,
            outOfStock,
            drafts,
            recentMovements,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(stock_movement_schema_1.StockMovement.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map