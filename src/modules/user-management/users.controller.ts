import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { Role } from '../../core/enums/role.enum';
import { createResponse } from '../../shared/appresponse.shared';
import { AuthenticatedUser } from '../../core/interfaces/authenticated-user.interface';
import { ChangePasswordDto } from '../auth/dto/auth.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('me')
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    const profile = await this.usersService.getProfile(user.userId);
    return createResponse(HttpStatus.OK, 'Profile fetched', profile);
  }

  @Patch('me')
  async updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: any) {
    const profile = await this.usersService.updateProfile(user.userId, dto);
    return createResponse(HttpStatus.OK, 'Profile updated', profile);
  }

  @Patch('me/password')
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
  ) {
    const result = await this.authService.changePassword(
      user.userId,
      dto.currentPassword,
      dto.newPassword,
    );
    return createResponse(HttpStatus.OK, result.message, null);
  }

  @Post('me/addresses')
  async addAddress(@CurrentUser() user: AuthenticatedUser, @Body() dto: any) {
    const addresses = await this.usersService.addAddress(user.userId, dto);
    return createResponse(HttpStatus.CREATED, 'Address added', addresses);
  }

  @Delete('me/addresses/:index')
  async removeAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Param('index') index: string,
  ) {
    const addresses = await this.usersService.removeAddress(user.userId, +index);
    return createResponse(HttpStatus.OK, 'Address removed', addresses);
  }

  // ---- Admin only: staff management ----
  @Get('staff')
  @Roles(Role.ADMIN)
  async listStaff() {
    const staff = await this.usersService.listStaff();
    return createResponse(HttpStatus.OK, 'Staff fetched', staff);
  }

  @Post('staff')
  @Roles(Role.ADMIN)
  async createStaff(
    @CurrentUser() admin: AuthenticatedUser,
    @Body() dto: { name: string; email: string; password: string; role: Role },
  ) {
    const staff = await this.authService.createStaffAccount(
      admin.userId,
      dto.name,
      dto.email,
      dto.password,
      dto.role,
    );
    return createResponse(HttpStatus.CREATED, 'Staff account created', staff);
  }

  @Patch('staff/:id/deactivate')
  @Roles(Role.ADMIN)
  async deactivateStaff(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    const staff = await this.usersService.setActive(id, false, user.userId);
    return createResponse(HttpStatus.OK, 'Staff deactivated', staff);
  }

  @Patch('staff/:id/activate')
  @Roles(Role.ADMIN)
  async activateStaff(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    const staff = await this.usersService.setActive(id, true, user.userId);
    return createResponse(HttpStatus.OK, 'Staff activated', staff);
  }
}
