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
import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupon.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from '../../core/enums/role.enum';
import { createResponse } from '../../shared/appresponse.shared';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateCouponDto) {
    const coupon = await this.couponsService.create(dto);
    return createResponse(HttpStatus.CREATED, 'Coupon created', coupon);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    const coupons = await this.couponsService.findAll();
    return createResponse(HttpStatus.OK, 'Coupons fetched', coupons);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    const coupon = await this.couponsService.update(id, dto);
    return createResponse(HttpStatus.OK, 'Coupon updated', coupon);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    await this.couponsService.remove(id);
    return createResponse(HttpStatus.OK, 'Coupon deleted', null);
  }

  // Customer-facing: check a code against their cart subtotal before checkout.
  @Post('validate')
  @UseGuards(JwtAuthGuard)
  async validate(@Body() dto: ValidateCouponDto) {
    const { discount } = await this.couponsService.validate(dto.code, dto.cartSubtotal);
    return createResponse(HttpStatus.OK, 'Coupon is valid', { discount });
  }
}
