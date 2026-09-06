import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';

// Exported so other feature modules (products, orders, users) can inject
// AuditLogService and record mutations without duplicating boilerplate.
@Module({
  imports: [DatabaseModule],
  controllers: [AuditLogController],
  providers: [AuditLogService],
  exports: [AuditLogService],
})
export class AuditLogModule {}
