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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const jwt_1 = require("@nestjs/jwt");
const user_schema_1 = require("../../database/schemas/user.schema");
const role_enum_1 = require("../../core/enums/role.enum");
const messages_shared_1 = require("../../shared/messages.shared");
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    isEmail(identifier) {
        return identifier.includes('@');
    }
    signToken(user) {
        return this.jwtService.sign({
            sub: user._id,
            email: user.email,
            role: user.role,
        });
    }
    toSafeUser(user) {
        const obj = user.toObject();
        delete obj.passwordHash;
        delete obj.resetPasswordToken;
        return obj;
    }
    async register(dto) {
        const identifierQueries = [
            dto.email ? { email: dto.email.toLowerCase().trim() } : null,
            dto.mobile ? { mobile: dto.mobile.trim() } : null,
        ].filter(Boolean);
        const existing = await this.userModel.findOne({ $or: identifierQueries });
        if (existing)
            throw new common_1.ConflictException(messages_shared_1.MESSAGES.AUTH.USER_EXISTS);
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.userModel.create({
            name: dto.name,
            email: dto.email?.toLowerCase(),
            mobile: dto.mobile,
            passwordHash,
            role: role_enum_1.Role.CUSTOMER,
        });
        const token = this.signToken(user);
        return { token, user: this.toSafeUser(user) };
    }
    async login(dto) {
        const query = this.isEmail(dto.identifier)
            ? { email: dto.identifier.toLowerCase() }
            : { mobile: dto.identifier };
        const user = await this.userModel.findOne(query);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException(messages_shared_1.MESSAGES.AUTH.INVALID_CREDENTIALS);
        }
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException(messages_shared_1.MESSAGES.AUTH.INVALID_CREDENTIALS);
        const token = this.signToken(user);
        return { token, user: this.toSafeUser(user) };
    }
    async forgotPassword(dto) {
        const query = this.isEmail(dto.identifier)
            ? { email: dto.identifier.toLowerCase() }
            : { mobile: dto.identifier };
        const user = await this.userModel.findOne(query);
        if (!user)
            return { message: 'If the account exists, reset instructions were sent' };
        const token = (0, uuid_1.v4)();
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30);
        await user.save();
        return { message: 'If the account exists, reset instructions were sent', devToken: token };
    }
    async resetPassword(dto) {
        const user = await this.userModel.findOne({
            resetPasswordToken: dto.token,
            resetPasswordExpires: { $gt: new Date() },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Reset token is invalid or expired');
        user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        return { message: 'Password reset successfully' };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        return { message: 'Password changed successfully' };
    }
    async createStaffAccount(creatorId, name, email, password, role) {
        const existing = await this.userModel.findOne({ email });
        if (existing)
            throw new common_1.ConflictException(messages_shared_1.MESSAGES.AUTH.USER_EXISTS);
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.userModel.create({
            name,
            email: email.toLowerCase(),
            passwordHash,
            role,
            createdBy: creatorId,
        });
        return this.toSafeUser(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map