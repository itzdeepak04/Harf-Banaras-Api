import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from '../../core/enums/role.enum';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../core/interfaces/authenticated-user.interface';
import { createResponse } from '../../shared/appresponse.shared';
import { MESSAGES } from '../../shared/messages.shared';
import { UpdateOrderStatusDto } from './dto/order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async placeOrder(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: { shippingAddress: any; giftMessage?: string; isGiftWrapped?: boolean },
  ) {
    const order = await this.ordersService.placeOrder(
      user.userId,
      dto.shippingAddress,
      dto.giftMessage,
      dto.isGiftWrapped,
    );
    return createResponse(HttpStatus.CREATED, MESSAGES.ORDER.PLACED, order);
  }

  @Get('my')
  async myOrders(@CurrentUser() user: AuthenticatedUser) {
    const orders = await this.ordersService.findMyOrders(user.userId);
    return createResponse(HttpStatus.OK, MESSAGES.ORDER.FETCHED, orders);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    return createResponse(HttpStatus.OK, 'Order fetched', order);
  }

  @Patch(':id/cancel')
  async cancel(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: { reason: string },
  ) {
    const order = await this.ordersService.cancelOrder(id, user.userId, dto.reason);
    return createResponse(HttpStatus.OK, MESSAGES.ORDER.CANCELLED, order);
  }

  // ---- Admin ----
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async findAll(@Query('status') status?: string) {
    const orders = await this.ordersService.findAllForAdmin(status);
    return createResponse(HttpStatus.OK, MESSAGES.ORDER.FETCHED, orders);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const order = await this.ordersService.updateStatus(id, dto.status, dto.note, user.userId);
    return createResponse(HttpStatus.OK, 'Order status updated', order);
  }
}
