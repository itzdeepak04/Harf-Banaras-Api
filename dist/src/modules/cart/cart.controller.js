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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
const jwt_auth_guard_1 = require("../../core/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../core/decorators/current-user.decorator");
const appresponse_shared_1 = require("../../shared/appresponse.shared");
const messages_shared_1 = require("../../shared/messages.shared");
const cart_dto_1 = require("./dto/cart.dto");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    async getCart(user) {
        const cart = await this.cartService.getCart(user.userId);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, messages_shared_1.MESSAGES.CART.FETCHED, cart);
    }
    async addItem(user, dto) {
        const cart = await this.cartService.addItem(user.userId, dto.productId, dto.quantity || 1);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, messages_shared_1.MESSAGES.CART.ADDED, cart);
    }
    async updateQuantity(user, productId, dto) {
        const cart = await this.cartService.updateQuantity(user.userId, productId, dto.quantity);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, messages_shared_1.MESSAGES.CART.UPDATED, cart);
    }
    async removeItem(user, productId) {
        const cart = await this.cartService.removeItem(user.userId, productId);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, messages_shared_1.MESSAGES.CART.REMOVED, cart);
    }
    async clearCart(user) {
        const cart = await this.cartService.clearCart(user.userId);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Cart cleared', cart);
    }
    async applyCoupon(user, dto) {
        const cart = await this.cartService.applyCoupon(user.userId, dto.code);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Coupon applied', cart);
    }
    async removeCoupon(user) {
        const cart = await this.cartService.removeCoupon(user.userId);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Coupon removed', cart);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('items'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Post)('items/:productId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateQuantity", null);
__decorate([
    (0, common_1.Delete)('items/:productId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearCart", null);
__decorate([
    (0, common_1.Post)('coupon'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cart_dto_1.ApplyCouponDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "applyCoupon", null);
__decorate([
    (0, common_1.Delete)('coupon'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeCoupon", null);
exports.CartController = CartController = __decorate([
    (0, common_1.Controller)('cart'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map