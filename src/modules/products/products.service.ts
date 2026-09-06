import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../database/schemas/product.schema';
import {
  StockMovement,
  StockMovementDocument,
} from '../../database/schemas/stock-movement.schema';
import { StockStatus } from '../../core/enums/product-status.enum';
import { ProductsAbstract } from './products.abstract';
import { ProductQueryDto } from './dto/product-query.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { convertToCSV, parseCSV } from '../../core/utils/export';
import { Category, CategoryDocument } from '../../database/schemas/category.schema';
import { BlobService } from '../../core/blob/blob.service';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductsService implements ProductsAbstract {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(StockMovement.name)
    private stockMovementModel: Model<StockMovementDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly auditLogService: AuditLogService,
    private readonly blobService: BlobService,
  ) {}

  private computeStockStatus(product: Product): StockStatus {
    if (product.availableQuantity <= 0) return StockStatus.OUT_OF_STOCK;
    if (product.availableQuantity <= product.lowStockThreshold)
      return StockStatus.LOW_STOCK;
    return StockStatus.IN_STOCK;
  }

  private async generateUniqueSku() {
    let sku = '';
    do {
      sku = `HB-${randomUUID().slice(0, 12).toUpperCase()}`;
    } while (await this.productModel.exists({ sku }));
    return sku;
  }

  async create(dto: any, userId: string) {
    const productData = { ...dto };
    productData.sku = productData.sku || await this.generateUniqueSku();
    productData.sareeType = await this.resolveCategory(productData.sareeType, 'saree_type');
    productData.occasions = await this.resolveCategories(productData.occasions, 'occasion');
    productData.collections = await this.resolveCategories(productData.collections, 'collection');
    productData.imagePaths = productData.imagePaths || productData.images || [];
    productData.images = productData.imagePaths;
    const stockStatus = this.computeStockStatus(productData);
    const product = await this.productModel.create({
      ...productData,
      stockStatus,
      createdBy: userId,
      updatedBy: userId,
    });
    await this.auditLogService.record(userId, 'PRODUCT_CREATED', 'Product', product._id.toString(), {
      name: product.name,
    });
    return this.withImageUrls(product);
  }

  private async resolveCategory(value: any, type: string) {
    if (!value) return undefined;
    if (/^[a-f\d]{24}$/i.test(String(value))) return value;
    const category = await this.categoryModel.findOne({ name: value, type, isActive: true });
    if (!category) throw new NotFoundException(`${type} category '${value}' not found`);
    return category._id;
  }

  private async resolveCategories(values: any, type: string) {
    if (!Array.isArray(values)) return [];
    return Promise.all(values.map((value) => this.resolveCategory(value, type)));
  }

  private async withImageUrls(product: any) {
    const item = typeof product.toObject === 'function' ? product.toObject() : product;
    const paths = item.imagePaths?.length ? item.imagePaths : item.images || [];
    const imageUrls = await Promise.all(paths.map(async (path: string) => {
      try {
        return (await this.blobService.createSasUrl(path, '', 'read')).url;
      } catch {
        return path;
      }
    }));
    return { ...item, imagePaths: paths, images: paths, imageUrls };
  }

  async findAll(query: ProductQueryDto) {
    const filter: any = { status: 'published' };

    if (query.search) filter.$text = { $search: query.search };
    if (query.sareeType) {
      const sareeType = /^[a-f\d]{24}$/i.test(query.sareeType)
        ? { _id: query.sareeType }
        : { slug: query.sareeType, type: 'saree_type', isActive: true };
      const sareeTypeCategory = await this.categoryModel.findOne(sareeType).select('_id');
      filter.sareeType = sareeTypeCategory?._id || { $in: [] };
    }
    if (query.fabric) filter.fabric = query.fabric;
    if (query.occasion) {
      const occasion = /^[a-f\d]{24}$/i.test(query.occasion)
        ? { _id: query.occasion }
        : { slug: query.occasion, type: 'occasion', isActive: true };
      const occasionCategory = await this.categoryModel.findOne(occasion).select('_id');
      filter.occasions = occasionCategory?._id || { $in: [] };
    }
    if (query.colour) filter.colour = query.colour;
    if (query.workIntensity) filter.workIntensity = query.workIntensity;
    if (query.isNewArrival === 'true') filter.isNewArrival = true;
    if (query.isBestSeller === 'true') filter.isBestSeller = true;
    if (query.inStockOnly === 'true')
      filter.stockStatus = { $ne: StockStatus.OUT_OF_STOCK };
    if (query.discountedOnly === 'true')
      filter.discountPrice = { $gt: 0 };

    if (query.minPrice || query.maxPrice) {
      filter.sellingPrice = {};
      if (query.minPrice) filter.sellingPrice.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.sellingPrice.$lte = Number(query.maxPrice);
    }

    const sortMap: Record<string, any> = {
      featured: { isBestSeller: -1, createdAt: -1 },
      newest: { createdAt: -1 },
      price_asc: { sellingPrice: 1 },
      price_desc: { sellingPrice: -1 },
      best_selling: { isBestSeller: -1 },
      rating: { createdAt: -1 }, // placeholder until rating aggregation is wired in
    };
    const sort = sortMap[query.sort || 'featured'];

    const page = Number(query.page) || 1;
    const limit = Number(query.limit || query.pageSize || query.pageLimit) || 5;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.productModel
        .find(filter)
        .populate('sareeType occasions collections')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      this.productModel.countDocuments(filter),
    ]);

    return {
      items: await Promise.all(items.map((item) => this.withImageUrls(item))),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findRelated(id: string, limit = 4) {
    const product = await this.productModel.findById(id).select('sareeType occasions');
    if (!product) throw new NotFoundException('Product not found');

    const products = await this.productModel
      .find({
        _id: { $ne: id },
        status: 'published',
        $or: [{ sareeType: product.sareeType }, { occasions: { $in: product.occasions } }],
      })
      .sort({ isBestSeller: -1, createdAt: -1 })
      .limit(Math.min(Math.max(limit, 1), 12));
    return Promise.all(products.map((product) => this.withImageUrls(product)));
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('sareeType occasions collections');
    if (!product) throw new NotFoundException('Product not found');
    return this.withImageUrls(product);
  }

  async update(id: string, dto: any, userId: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    const changedFields = Object.keys(dto);
    Object.assign(product, dto, { updatedBy: userId });
    product.stockStatus = this.computeStockStatus(product);
    await product.save();

    await this.auditLogService.record(userId, 'PRODUCT_UPDATED', 'Product', id, {
      changedFields,
    });

    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { status: 'archived' },
      { new: true },
    );
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // Requires a reason; records movement history (Inventory Manager / Admin only)
  async adjustStock(id: string, changeQuantity: number, reason: string, userId: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    product.availableQuantity = Math.max(0, product.availableQuantity + changeQuantity);
    product.stockStatus = this.computeStockStatus(product);
    product.updatedBy = userId as any;
    await product.save();

    await this.stockMovementModel.create({
      product: id,
      changeQuantity,
      reason,
      performedBy: userId,
    });

    await this.auditLogService.record(userId, 'STOCK_ADJUSTED', 'Product', id, {
      changeQuantity,
      reason,
      newQuantity: product.availableQuantity,
    });

    return product;
  }

  // Used internally by the cart/order flow to validate & decrement stock atomically-ish
  async decrementForOrder(productId: string, quantity: number) {
    const product = await this.productModel.findOneAndUpdate(
      { _id: productId, availableQuantity: { $gte: quantity } },
      { $inc: { availableQuantity: -quantity } },
      { new: true },
    );
    if (!product) return null;
    product.stockStatus = this.computeStockStatus(product);
    await product.save();
    return product;
  }

  async restockForCancellation(productId: string, quantity: number) {
    const product = await this.productModel.findById(productId);
    if (!product) return null;
    product.availableQuantity += quantity;
    product.stockStatus = this.computeStockStatus(product);
    await product.save();
    return product;
  }

  async exportInventory() {
    const products = await this.productModel.find().select(
      'sku name availableQuantity lowStockThreshold stockStatus sellingPrice status',
    ).lean();
    return convertToCSV(products);
  }

  async importInventory(csv: string, userId: string) {
    const rows = parseCSV(csv);
    if (!rows.length) throw new Error('CSV must contain at least one inventory row');

    const results: { sku: string; updated: boolean; message?: string }[] = [];
    for (const row of rows) {
      const sku = row.sku;
      const changeQuantity = Number(row.changeQuantity);
      if (!sku || !Number.isInteger(changeQuantity) || !row.reason) {
        results.push({ sku: sku || '', updated: false, message: 'sku, integer changeQuantity, and reason are required' });
        continue;
      }

      const product = await this.productModel.findOne({ sku });
      if (!product) {
        results.push({ sku, updated: false, message: 'Product not found' });
        continue;
      }
      await this.adjustStock(product._id.toString(), changeQuantity, row.reason, userId);
      results.push({ sku, updated: true });
    }
    return results;
  }
}
