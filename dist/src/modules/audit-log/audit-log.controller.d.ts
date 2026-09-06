import { AuditLogService } from './audit-log.service';
export declare class AuditLogController {
    private readonly auditLogService;
    constructor(auditLogService: AuditLogService);
    findAll(entityType?: string, entityId?: string, page?: string, limit?: string): Promise<import("../../shared/appresponse.shared").AppResponse<{
        items: (import("mongoose").Document<unknown, {}, import("../../database/schemas").AuditLogDocument, {}, {}> & import("../../database/schemas").AuditLog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>>;
}
