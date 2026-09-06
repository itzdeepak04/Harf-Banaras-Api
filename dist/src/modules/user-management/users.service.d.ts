import { Model } from 'mongoose';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { UsersAbstract } from './users.abstract';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class UsersService implements UsersAbstract {
    private userModel;
    private readonly auditLogService;
    constructor(userModel: Model<UserDocument>, auditLogService: AuditLogService);
    getProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateProfile(userId: string, dto: Partial<User>): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    addAddress(userId: string, dto: any): Promise<import("../../database/schemas/user.schema").Address[]>;
    removeAddress(userId: string, addressIndex: number): Promise<import("../../database/schemas/user.schema").Address[]>;
    listStaff(): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    setActive(userId: string, isActive: boolean, performedBy?: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
