import { Controller, Delete, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../core/interfaces/authenticated-user.interface';
import { createResponse } from '../../shared/appresponse.shared';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async get(@CurrentUser() user: AuthenticatedUser) {
    const wishlist = await this.wishlistService.get(user.userId);
    return createResponse(HttpStatus.OK, 'Wishlist fetched', wishlist);
  }

  @Post(':productId')
  async add(@CurrentUser() user: AuthenticatedUser, @Param('productId') productId: string) {
    const wishlist = await this.wishlistService.add(user.userId, productId);
    return createResponse(HttpStatus.OK, 'Added to wishlist', wishlist);
  }

  @Delete(':productId')
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('productId') productId: string) {
    const wishlist = await this.wishlistService.remove(user.userId, productId);
    return createResponse(HttpStatus.OK, 'Removed from wishlist', wishlist);
  }
}
