"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const schemas_1 = require("./schemas");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('MONGO_URI'),
                }),
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: schemas_1.User.name, schema: schemas_1.UserSchema },
                { name: schemas_1.Category.name, schema: schemas_1.CategorySchema },
                { name: schemas_1.Product.name, schema: schemas_1.ProductSchema },
                { name: schemas_1.StockMovement.name, schema: schemas_1.StockMovementSchema },
                { name: schemas_1.Cart.name, schema: schemas_1.CartSchema },
                { name: schemas_1.Wishlist.name, schema: schemas_1.WishlistSchema },
                { name: schemas_1.Order.name, schema: schemas_1.OrderSchema },
                { name: schemas_1.Review.name, schema: schemas_1.ReviewSchema },
                { name: schemas_1.AuditLog.name, schema: schemas_1.AuditLogSchema },
                { name: schemas_1.Coupon.name, schema: schemas_1.CouponSchema },
                { name: schemas_1.Settings.name, schema: schemas_1.SettingsSchema },
            ]),
        ],
        exports: [mongoose_1.MongooseModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map