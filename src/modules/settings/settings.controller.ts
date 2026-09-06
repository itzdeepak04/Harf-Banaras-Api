import { Body, Controller, Get, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from '../../core/enums/role.enum';
import { createResponse } from '../../shared/appresponse.shared';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // Public read — the frontend needs shipping threshold/fee to show
  // "free shipping above ₹X" messaging without requiring login.
  @Get()
  async get() {
    const settings = await this.settingsService.get();
    return createResponse(HttpStatus.OK, 'Settings fetched', settings);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Body()
    dto: { flatShippingFee?: number; freeShippingThreshold?: number; taxPercent?: number },
  ) {
    const settings = await this.settingsService.update(dto);
    return createResponse(HttpStatus.OK, 'Settings updated', settings);
  }
}
