import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<import("../../shared/appresponse.shared").AppResponse<{
        token: string;
        user: any;
    }>>;
    login(dto: LoginDto): Promise<import("../../shared/appresponse.shared").AppResponse<{
        token: string;
        user: any;
    }>>;
    forgotPassword(dto: ForgotPasswordDto): Promise<import("../../shared/appresponse.shared").AppResponse<{
        message: string;
        devToken?: undefined;
    } | {
        message: string;
        devToken: any;
    }>>;
    resetPassword(dto: ResetPasswordDto): Promise<import("../../shared/appresponse.shared").AppResponse<any>>;
}
