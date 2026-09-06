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
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from '../../core/enums/role.enum';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../core/interfaces/authenticated-user.interface';
import { createResponse } from '../../shared/appresponse.shared';
import { MESSAGES } from '../../shared/messages.shared';
import { BlobService } from '../../core/blob/blob.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly blobService: BlobService,
  ) {}

  @Post('image-sas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INVENTORY_MANAGER)
  async createImageSas(@Body() dto: { path: string; contentType: string; mode: 'upload' | 'read' }) {
    const result = await this.blobService.createSasUrl(dto.path, dto.contentType, dto.mode);
    return createResponse(HttpStatus.OK, 'Blob SAS URL created', result);
  }

  @Get('inventory/export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INVENTORY_MANAGER)
  async exportInventory(@Res() response: any) {
    const csv = await this.productsService.exportInventory();
    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    response.setHeader('Content-Disposition', 'attachment; filename="inventory.csv"');
    return response.send(csv);
  }

  @Post('inventory/import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INVENTORY_MANAGER)
  async importInventory(
    @Body() dto: { csv: string },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.productsService.importInventory(dto.csv, user.userId);
    return createResponse(HttpStatus.OK, 'Inventory import completed', result);
  }

  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    const result = await this.productsService.findAll(query);
    return createResponse(HttpStatus.OK, MESSAGES.PRODUCT.FETCHED, result);
  }

  @Post('search')
  async search(@Body() query: ProductQueryDto) {
    const result = await this.productsService.findAll(query);
    return createResponse(HttpStatus.OK, MESSAGES.PRODUCT.FETCHED, result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    return createResponse(HttpStatus.OK, 'Product fetched', product);
  }

  @Get(':id/related')
  async findRelated(@Param('id') id: string, @Query('limit') limit?: string) {
    const products = await this.productsService.findRelated(id, Number(limit) || 4);
    return createResponse(HttpStatus.OK, 'Related products fetched', products);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INVENTORY_MANAGER)
  async create(@Body() dto: any, @CurrentUser() user: AuthenticatedUser) {
    const product = await this.productsService.create(dto, user.userId);
    return createResponse(HttpStatus.CREATED, MESSAGES.PRODUCT.CREATED, product);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INVENTORY_MANAGER)
  async update(
    @Param('id') id: string,
    @Body() dto: any,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const product = await this.productsService.update(id, dto, user.userId);
    return createResponse(HttpStatus.OK, MESSAGES.PRODUCT.UPDATED, product);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    const product = await this.productsService.remove(id);
    return createResponse(HttpStatus.OK, MESSAGES.PRODUCT.DELETED, product);
  }

  // Stock adjustment always requires a reason; recorded in stock movement history
  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INVENTORY_MANAGER)
  async adjustStock(
    @Param('id') id: string,
    @Body() dto: { changeQuantity: number; reason: string },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const product = await this.productsService.adjustStock(
      id,
      dto.changeQuantity,
      dto.reason,
      user.userId,
    );
    return createResponse(HttpStatus.OK, 'Stock updated', product);
  }
}
