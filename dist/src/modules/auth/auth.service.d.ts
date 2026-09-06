import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../../database/schemas/user.schema';
import { AuthAbstract } from './auth.abstract';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { Role } from '../../core/enums/role.enum';
export declare class AuthService implements AuthAbstract {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    private isEmail;
    private signToken;
    private toSafeUser;
    register(dto: RegisterDto): Promise<{
        token: string;
        user: any;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: any;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
        devToken?: undefined;
    } | {
        message: string;
        devToken: any;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    createStaffAccount(creatorId: string, name: string, email: string, password: string, role: Role): Promise<any>;
}
