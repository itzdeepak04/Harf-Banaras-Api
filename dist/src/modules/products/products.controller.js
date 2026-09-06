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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const product_query_dto_1 = require("./dto/product-query.dto");
const jwt_auth_guard_1 = require("../../core/guards/jwt-auth.guard");
const roles_guard_1 = require("../../core/guards/roles.guard");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const role_enum_1 = require("../../core/enums/role.enum");
const current_user_decorator_1 = require("../../core/decorators/current-user.decorator");
const appresponse_shared_1 = require("../../shared/appresponse.shared");
const messages_shared_1 = require("../../shared/messages.shared");
const blob_service_1 = require("../../core/blob/blob.service");
let ProductsController = class ProductsController {
    constructor(productsService, blobService) {
        this.productsService = productsService;
        this.blobService = blobService;
    }
    async createImageSas(dto) {
        const result = await this.blobService.createSasUrl(dto.path, dto.contentType, dto.mode);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Blob SAS URL created', result);
    }
    async exportInventory(response) {
        const csv = await this.productsService.exportInventory();
        response.setHeader('Content-Type', 'text/csv; charset=utf-8');
        response.setHeader('Content-Disposition', 'attachment; filename="inventory.csv"');
        return response.send(csv);
    }
    async importInventory(dto, user) {
        const result = await this.productsService.importInventory(dto.csv, user.userId);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Inventory import completed', result);
    }
    async findAll(query) {
        const result = await this.productsService.findAll(query);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, messages_shared_1.MESSAGES.PRODUCT.FETCHED, result);
    }
    async search(query) {
        const result = await this.productsService.findAll(query);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, messages_shared_1.MESSAGES.PRODUCT.FETCHED, result);
    }
    async findOne(id) {
        const product = await this.productsService.findOne(id);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Product fetched', product);
    }
    async findRelated(id, limit) {
        const products = await this.productsService.findRelated(id, Number(limit) || 4);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Related products fetched', products);
    }
    async create(dto, user) {
        const product = await this.productsService.create(dto, user.userId);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.CREATED, messages_shared_1.MESSAGES.PRODUCT.CREATED, product);
    }
    async update(id, dto, user) {
        const product = await this.productsService.update(id, dto, user.userId);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, messages_shared_1.MESSAGES.PRODUCT.UPDATED, product);
    }
    async remove(id) {
        const product = await this.productsService.remove(id);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, messages_shared_1.MESSAGES.PRODUCT.DELETED, product);
    }
    async adjustStock(id, dto, user) {
        const product = await this.productsService.adjustStock(id, dto.changeQuantity, dto.reason, user.userId);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Stock updated', product);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)('image-sas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.INVENTORY_MANAGER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createImageSas", null);
__decorate([
    (0, common_1.Get)('inventory/export'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.INVENTORY_MANAGER),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "exportInventory", null);
__decorate([
    (0, common_1.Post)('inventory/import'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.INVENTORY_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "importInventory", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_query_dto_1.ProductQueryDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('search'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_query_dto_1.ProductQueryDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/related'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findRelated", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.INVENTORY_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.INVENTORY_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/stock'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.INVENTORY_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "adjustStock", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        blob_service_1.BlobService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map