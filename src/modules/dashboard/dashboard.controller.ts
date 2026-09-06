import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from '../../core/enums/role.enum';
import { createResponse } from '../../shared/appresponse.shared';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Roles(Role.ADMIN)
  async adminSummary() {
    const summary = await this.dashboardService.adminSummary();
    return createResponse(HttpStatus.OK, 'Admin dashboard fetched', summary);
  }

  @Get('inventory')
  @Roles(Role.ADMIN, Role.INVENTORY_MANAGER)
  async inventorySummary() {
    const summary = await this.dashboardService.inventorySummary();
    return createResponse(HttpStatus.OK, 'Inventory dashboard fetched', summary);
  }
}
