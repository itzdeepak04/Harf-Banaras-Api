import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from '../../core/enums/role.enum';
import { createResponse } from '../../shared/appresponse.shared';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(@Query('type') type?: string) {
    const categories = await this.categoriesService.findAll(type);
    return createResponse(HttpStatus.OK, 'Categories fetched', categories);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INVENTORY_MANAGER)
  async create(@Body() dto: any) {
    const category = await this.categoriesService.create(dto);
    return createResponse(HttpStatus.CREATED, 'Category created', category);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: any) {
    const category = await this.categoriesService.update(id, dto);
    return createResponse(HttpStatus.OK, 'Category updated', category);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    const category = await this.categoriesService.remove(id);
    return createResponse(HttpStatus.OK, 'Category archived', category);
  }
}
