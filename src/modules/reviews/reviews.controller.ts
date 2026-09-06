import { Body, Controller, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from '../../core/enums/role.enum';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../core/interfaces/authenticated-user.interface';
import { createResponse } from '../../shared/appresponse.shared';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  async findForProduct(@Param('productId') productId: string) {
    const reviews = await this.reviewsService.findForProduct(productId);
    return createResponse(HttpStatus.OK, 'Reviews fetched', reviews);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: any) {
    const review = await this.reviewsService.create(user.userId, dto);
    return createResponse(HttpStatus.CREATED, 'Review submitted', review);
  }

  @Patch(':id/moderate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async moderate(@Param('id') id: string, @Body() dto: { status: 'approved' | 'rejected' }) {
    const review = await this.reviewsService.moderate(id, dto.status);
    return createResponse(HttpStatus.OK, 'Review moderated', review);
  }
}
