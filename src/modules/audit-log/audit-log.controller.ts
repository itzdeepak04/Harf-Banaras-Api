import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from '../../core/enums/role.enum';
import { createResponse } from '../../shared/appresponse.shared';

@Controller('audit-log')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async findAll(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    const result = await this.auditLogService.findAll(
      { entityType, entityId },
      +page,
      +limit,
    );
    return createResponse(HttpStatus.OK, 'Audit log fetched', result);
  }
}
