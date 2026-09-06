import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { createResponse } from '../../shared/appresponse.shared';
import { MESSAGES } from '../../shared/messages.shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return createResponse(HttpStatus.CREATED, MESSAGES.AUTH.REGISTER_SUCCESS, result);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return createResponse(HttpStatus.OK, MESSAGES.AUTH.LOGIN_SUCCESS, result);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(dto);
    return createResponse(HttpStatus.OK, result.message, result);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(dto);
    return createResponse(HttpStatus.OK, result.message, null);
  }
}
