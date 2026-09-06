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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const auth_service_1 = require("../auth/auth.service");
const jwt_auth_guard_1 = require("../../core/guards/jwt-auth.guard");
const roles_guard_1 = require("../../core/guards/roles.guard");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const current_user_decorator_1 = require("../../core/decorators/current-user.decorator");
const role_enum_1 = require("../../core/enums/role.enum");
const appresponse_shared_1 = require("../../shared/appresponse.shared");
const auth_dto_1 = require("../auth/dto/auth.dto");
let UsersController = class UsersController {
    constructor(usersService, authService) {
        this.usersService = usersService;
        this.authService = authService;
    }
    async getProfile(user) {
        const profile = await this.usersService.getProfile(user.userId);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Profile fetched', profile);
    }
    async updateProfile(user, dto) {
        const profile = await this.usersService.updateProfile(user.userId, dto);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Profile updated', profile);
    }
    async changePassword(user, dto) {
        const result = await this.authService.changePassword(user.userId, dto.currentPassword, dto.newPassword);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, result.message, null);
    }
    async addAddress(user, dto) {
        const addresses = await this.usersService.addAddress(user.userId, dto);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.CREATED, 'Address added', addresses);
    }
    async removeAddress(user, index) {
        const addresses = await this.usersService.removeAddress(user.userId, +index);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Address removed', addresses);
    }
    async listStaff() {
        const staff = await this.usersService.listStaff();
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Staff fetched', staff);
    }
    async createStaff(admin, dto) {
        const staff = await this.authService.createStaffAccount(admin.userId, dto.name, dto.email, dto.password, dto.role);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.CREATED, 'Staff account created', staff);
    }
    async deactivateStaff(user, id) {
        const staff = await this.usersService.setActive(id, false, user.userId);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Staff deactivated', staff);
    }
    async activateStaff(user, id) {
        const staff = await this.usersService.setActive(id, true, user.userId);
        return (0, appresponse_shared_1.createResponse)(common_1.HttpStatus.OK, 'Staff activated', staff);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('me/password'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('me/addresses'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addAddress", null);
__decorate([
    (0, common_1.Delete)('me/addresses/:index'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('index')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeAddress", null);
__decorate([
    (0, common_1.Get)('staff'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "listStaff", null);
__decorate([
    (0, common_1.Post)('staff'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createStaff", null);
__decorate([
    (0, common_1.Patch)('staff/:id/deactivate'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deactivateStaff", null);
__decorate([
    (0, common_1.Patch)('staff/:id/activate'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "activateStaff", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_service_1.AuthService])
], UsersController);
//# sourceMappingURL=users.controller.js.map