export declare class RegisterDto {
    name: string;
    email?: string;
    mobile?: string;
    password: string;
}
export declare class LoginDto {
    identifier: string;
    password: string;
}
export declare class ForgotPasswordDto {
    identifier: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
