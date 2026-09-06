import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../core/interfaces/authenticated-user.interface';
import { createResponse } from '../../shared/appresponse.shared';
import { MESSAGES } from '../../shared/messages.shared';
import { ApplyCouponDto } from './dto/cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() user: AuthenticatedUser) {
    const cart = await this.cartService.getCart(user.userId);
    return createResponse(HttpStatus.OK, MESSAGES.CART.FETCHED, cart);
  }

  @Post('items')
  async addItem(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: { productId: string; quantity: number },
  ) {
    const cart = await this.cartService.addItem(user.userId, dto.productId, dto.quantity || 1);
    return createResponse(HttpStatus.OK, MESSAGES.CART.ADDED, cart);
  }

  @Post('items/:productId')
  async updateQuantity(
    @CurrentUser() user: AuthenticatedUser,
    @Param('productId') productId: string,
    @Body() dto: { quantity: number },
  ) {
    const cart = await this.cartService.updateQuantity(user.userId, productId, dto.quantity);
    return createResponse(HttpStatus.OK, MESSAGES.CART.UPDATED, cart);
  }

  @Delete('items/:productId')
  async removeItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('productId') productId: string,
  ) {
    const cart = await this.cartService.removeItem(user.userId, productId);
    return createResponse(HttpStatus.OK, MESSAGES.CART.REMOVED, cart);
  }

  @Delete()
  async clearCart(@CurrentUser() user: AuthenticatedUser) {
    const cart = await this.cartService.clearCart(user.userId);
    return createResponse(HttpStatus.OK, 'Cart cleared', cart);
  }

  @Post('coupon')
  async applyCoupon(@CurrentUser() user: AuthenticatedUser, @Body() dto: ApplyCouponDto) {
    const cart = await this.cartService.applyCoupon(user.userId, dto.code);
    return createResponse(HttpStatus.OK, 'Coupon applied', cart);
  }

  @Delete('coupon')
  async removeCoupon(@CurrentUser() user: AuthenticatedUser) {
    const cart = await this.cartService.removeCoupon(user.userId);
    return createResponse(HttpStatus.OK, 'Coupon removed', cart);
  }
}
