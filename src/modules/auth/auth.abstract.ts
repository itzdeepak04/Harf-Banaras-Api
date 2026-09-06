import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';

export abstract class AuthAbstract {
  abstract register(dto: RegisterDto): Promise<any>;
  abstract login(dto: LoginDto): Promise<any>;
  abstract forgotPassword(dto: ForgotPasswordDto): Promise<any>;
  abstract resetPassword(dto: ResetPasswordDto): Promise<any>;
}
