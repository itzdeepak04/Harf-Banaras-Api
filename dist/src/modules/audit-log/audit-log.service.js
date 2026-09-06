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
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const audit_log_schema_1 = require("../../database/schemas/audit-log.schema");
let AuditLogService = class AuditLogService {
    constructor(auditLogModel) {
        this.auditLogModel = auditLogModel;
    }
    async record(performedBy, action, entityType, entityId, meta = {}) {
        return this.auditLogModel.create({ performedBy, action, entityType, entityId, meta });
    }
    async findAll(filter = {}, page = 1, limit = 50) {
        const query = {};
        if (filter.entityType)
            query.entityType = filter.entityType;
        if (filter.entityId)
            query.entityId = filter.entityId;
        const [items, total] = await Promise.all([
            this.auditLogModel
                .find(query)
                .populate('performedBy', 'name email role')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            this.auditLogModel.countDocuments(query),
        ]);
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map