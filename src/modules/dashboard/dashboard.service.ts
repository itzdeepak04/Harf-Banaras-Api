import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../../database/schemas/order.schema';
import { Product, ProductDocument } from '../../database/schemas/product.schema';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { StockMovement, StockMovementDocument } from '../../database/schemas/stock-movement.schema';
import { OrderStatus } from '../../core/enums/order-status.enum';
import { StockStatus, ProductStatus } from '../../core/enums/product-status.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(StockMovement.name) private stockMovementModel: Model<StockMovementDocument>,
  ) {}

  // Full admin dashboard
  async adminSummary() {
    const [
      totalOrders,
      pendingOrders,
      pendingReturns,
      lowStock,
      outOfStock,
      revenueAgg,
      newCustomers30d,
    ] = await Promise.all([
      this.orderModel.countDocuments(),
      this.orderModel.countDocuments({ status: OrderStatus.PLACED }),
      this.orderModel.countDocuments({ status: OrderStatus.RETURN_REQUESTED }),
      this.productModel.countDocuments({ stockStatus: StockStatus.LOW_STOCK }),
      this.productModel.countDocuments({ stockStatus: StockStatus.OUT_OF_STOCK }),
      this.orderModel.aggregate([
        { $match: { status: { $ne: OrderStatus.CANCELLED } } },
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

  // Simpler dashboard for Inventory Managers
  async inventorySummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalActive,
      addedToday,
      lowStock,
      outOfStock,
      drafts,
      recentMovements,
    ] = await Promise.all([
      this.productModel.countDocuments({ status: ProductStatus.PUBLISHED }),
      this.productModel.countDocuments({ createdAt: { $gte: today } }),
      this.productModel.countDocuments({ stockStatus: StockStatus.LOW_STOCK }),
      this.productModel.countDocuments({ stockStatus: StockStatus.OUT_OF_STOCK }),
      this.productModel.countDocuments({ status: ProductStatus.DRAFT }),
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
}
