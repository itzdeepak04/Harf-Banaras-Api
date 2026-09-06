import { IsEmail, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class RegisterDto {
  @IsString() name: string;

  @ValidateIf((o) => !o.mobile)
  @IsEmail()
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsString()
  mobile?: string;

  @MinLength(6) password: string;
}

export class LoginDto {
  @IsString() identifier: string; // email or mobile
  @IsString() password: string;
}

export class ForgotPasswordDto {
  @IsString() identifier: string;
}

export class ResetPasswordDto {
  @IsString() token: string;
  @MinLength(6) newPassword: string;
}

export class ChangePasswordDto {
  @IsString() currentPassword: string;
  @MinLength(6) newPassword: string;
}
