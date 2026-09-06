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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../database/schemas/user.schema");
const role_enum_1 = require("../../core/enums/role.enum");
const audit_log_service_1 = require("../audit-log/audit-log.service");
let UsersService = class UsersService {
    constructor(userModel, auditLogService) {
        this.userModel = userModel;
        this.auditLogService = auditLogService;
    }
    async getProfile(userId) {
        const user = await this.userModel.findById(userId).select('-passwordHash');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateProfile(userId, dto) {
        const user = await this.userModel.findByIdAndUpdate(userId, { $set: { name: dto.name } }, { new: true }).select('-passwordHash');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async addAddress(userId, dto) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (dto.isDefault)
            user.addresses.forEach((a) => (a.isDefault = false));
        user.addresses.push(dto);
        await user.save();
        return user.addresses;
    }
    async removeAddress(userId, addressIndex) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.addresses.splice(addressIndex, 1);
        await user.save();
        return user.addresses;
    }
    async listStaff() {
        return this.userModel
            .find({ role: { $in: [role_enum_1.Role.ADMIN, role_enum_1.Role.INVENTORY_MANAGER] } })
            .select('-passwordHash');
    }
    async setActive(userId, isActive, performedBy) {
        const user = await this.userModel.findByIdAndUpdate(userId, { isActive }, { new: true }).select('-passwordHash');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (performedBy) {
            await this.auditLogService.record(performedBy, isActive ? 'STAFF_ACTIVATED' : 'STAFF_DEACTIVATED', 'User', userId, { role: user.role });
        }
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        audit_log_service_1.AuditLogService])
], UsersService);
//# sourceMappingURL=users.service.js.map