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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const jwt_auth_guard_1 = require("../../core/guards/jwt-auth.guard");
const roles_guard_1 = require("../../core/guards/roles.guard");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const role_enum_1 = require("../../core/enums/role.enum");
const current_user_decorator_1 = require("../../core/decorators/current-user.decorator");
const appresponse_shared_1 = require("../../shared/appresponse.shared");
const messages_shared_1 = require("../../shared/messages.shared");
const order_dto_1 = require("./dto/order.dto");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async placeOrder(user, dto) {
        const order = await this.ordersService.placeOrder(user.userId, dto.shippingAddress, dto.giftMessage, dto.isGiftWrapped);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.CREATED, messages_shared_1.MESSAGES.ORDER.PLACED, order);
    }
    async myOrders(user) {
        const orders = await this.ordersService.findMyOrders(user.userId);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, messages_shared_1.MESSAGES.ORDER.FETCHED, orders);
    }
    async findOne(id) {
        const order = await this.ordersService.findOne(id);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Order fetched', order);
    }
    async cancel(user, id, dto) {
        const order = await this.ordersService.cancelOrder(id, user.userId, dto.reason);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, messages_shared_1.MESSAGES.ORDER.CANCELLED, order);
    }
    async findAll(status) {
        const orders = await this.ordersService.findAllForAdmin(status);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, messages_shared_1.MESSAGES.ORDER.FETCHED, orders);
    }
    async updateStatus(user, id, dto) {
        const order = await this.ordersService.updateStatus(id, dto.status, dto.note, user.userId);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Order status updated', order);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "placeOrder", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "myOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, order_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map