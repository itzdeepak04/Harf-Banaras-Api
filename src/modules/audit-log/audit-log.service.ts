import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from '../../database/schemas/audit-log.schema';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async record(
    performedBy: string,
    action: string,
    entityType: string,
    entityId: string,
    meta: Record<string, any> = {},
  ) {
    return this.auditLogModel.create({ performedBy, action, entityType, entityId, meta });
  }

  async findAll(filter: { entityType?: string; entityId?: string } = {}, page = 1, limit = 50) {
    const query: any = {};
    if (filter.entityType) query.entityType = filter.entityType;
    if (filter.entityId) query.entityId = filter.entityId;

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
}
