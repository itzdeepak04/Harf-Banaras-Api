import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  User,
  UserSchema,
  Category,
  CategorySchema,
  Product,
  ProductSchema,
  StockMovement,
  StockMovementSchema,
  Cart,
  CartSchema,
  Wishlist,
  WishlistSchema,
  Order,
  OrderSchema,
  Review,
  ReviewSchema,
  AuditLog,
  AuditLogSchema,
  Coupon,
  CouponSchema,
  Settings,
  SettingsSchema,
} from './schemas';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: StockMovement.name, schema: StockMovementSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Wishlist.name, schema: WishlistSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Settings.name, schema: SettingsSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
