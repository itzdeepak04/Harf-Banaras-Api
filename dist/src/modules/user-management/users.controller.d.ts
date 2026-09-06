import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { Role } from '../../core/enums/role.enum';
import { AuthenticatedUser } from '../../core/interfaces/authenticated-user.interface';
import { ChangePasswordDto } from '../auth/dto/auth.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    getProfile(user: AuthenticatedUser): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").UserDocument, {}, {}> & import("../../database/schemas").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    updateProfile(user: AuthenticatedUser, dto: any): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").UserDocument, {}, {}> & import("../../database/schemas").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    changePassword(user: AuthenticatedUser, dto: ChangePasswordDto): Promise<import("../../shared/appresponse.shared").AppResponse<any>>;
    addAddress(user: AuthenticatedUser, dto: any): Promise<import("../../shared/appresponse.shared").AppResponse<import("../../database/schemas").Address[]>>;
    removeAddress(user: AuthenticatedUser, index: string): Promise<import("../../shared/appresponse.shared").AppResponse<import("../../database/schemas").Address[]>>;
    listStaff(): Promise<import("../../shared/appresponse.shared").AppResponse<(import("mongoose").Document<unknown, {}, import("../../database/schemas").UserDocument, {}, {}> & import("../../database/schemas").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>>;
    createStaff(admin: AuthenticatedUser, dto: {
        name: string;
        email: string;
        password: string;
        role: Role;
    }): Promise<import("../../shared/appresponse.shared").AppResponse<any>>;
    deactivateStaff(user: AuthenticatedUser, id: string): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").UserDocument, {}, {}> & import("../../database/schemas").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    activateStaff(user: AuthenticatedUser, id: string): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").UserDocument, {}, {}> & import("../../database/schemas").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
}
