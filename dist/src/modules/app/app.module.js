"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("../../database/database.module");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../user-management/users.module");
const categories_module_1 = require("../categories/categories.module");
const products_module_1 = require("../products/products.module");
const cart_module_1 = require("../cart/cart.module");
const wishlist_module_1 = require("../wishlist/wishlist.module");
const orders_module_1 = require("../orders/orders.module");
const reviews_module_1 = require("../reviews/reviews.module");
const dashboard_module_1 = require("../dashboard/dashboard.module");
const coupons_module_1 = require("../coupons/coupons.module");
const settings_module_1 = require("../settings/settings.module");
const audit_log_module_1 = require("../audit-log/audit-log.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const blob_module_1 = require("../../core/blob/blob.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            cart_module_1.CartModule,
            wishlist_module_1.WishlistModule,
            orders_module_1.OrdersModule,
            reviews_module_1.ReviewsModule,
            dashboard_module_1.DashboardModule,
            coupons_module_1.CouponsModule,
            settings_module_1.SettingsModule,
            audit_log_module_1.AuditLogModule,
            blob_module_1.BlobModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map