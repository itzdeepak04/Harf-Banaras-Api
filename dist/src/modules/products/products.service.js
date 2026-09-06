"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../../database/schemas/product.schema");
const stock_movement_schema_1 = require("../../database/schemas/stock-movement.schema");
const product_status_enum_1 = require("../../core/enums/product-status.enum");
const product_status_enum_2 = require("../../core/enums/product-status.enum");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const export_1 = require("../../core/utils/export");
const category_schema_1 = require("../../database/schemas/category.schema");
const blob_service_1 = require("../../core/blob/blob.service");
const notification_gateway_1 = require("../notifications/notification.gateway");
const crypto_1 = require("crypto");
let ProductsService = class ProductsService {
    constructor(productModel, stockMovementModel, categoryModel, auditLogService, blobService, notificationGateway) {
        this.productModel = productModel;
        this.stockMovementModel = stockMovementModel;
        this.categoryModel = categoryModel;
        this.auditLogService = auditLogService;
        this.blobService = blobService;
        this.notificationGateway = notificationGateway;
    }
    computeStockStatus(product) {
        if (product.availableQuantity <= 0)
            return product_status_enum_1.StockStatus.OUT_OF_STOCK;
        if (product.availableQuantity <= product.lowStockThreshold)
            return product_status_enum_1.StockStatus.LOW_STOCK;
        return product_status_enum_1.StockStatus.IN_STOCK;
    }
    async generateUniqueSku() {
        let sku = '';
        do {
            sku = `HB-${(0, crypto_1.randomUUID)().slice(0, 12).toUpperCase()}`;
        } while (await this.productModel.exists({ sku }));
        return sku;
    }
    async create(dto, userId) {
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
        if (product.status === product_status_enum_2.ProductStatus.PUBLISHED) {
            this.notificationGateway.notifyCustomers({
                type: 'product_created',
                title: 'A new saree has arrived',
                message: `${product.name} is now available in the collection.`,
                route: `/product/${product._id}`,
                entityId: product._id.toString(),
            });
        }
        return this.withImageUrls(product);
    }
    async resolveCategory(value, type) {
        if (!value)
            return undefined;
        if (/^[a-f\d]{24}$/i.test(String(value)))
            return value;
        const category = await this.categoryModel.findOne({ name: value, type, isActive: true });
        if (!category)
            throw new common_1.NotFoundException(`${type} category '${value}' not found`);
        return category._id;
    }
    async resolveCategories(values, type) {
        if (!Array.isArray(values))
            return [];
        return Promise.all(values.map((value) => this.resolveCategory(value, type)));
    }
    async withImageUrls(product) {
        const item = typeof product.toObject === 'function' ? product.toObject() : product;
        const paths = item.imagePaths?.length ? item.imagePaths : item.images || [];
        const imageUrls = await Promise.all(paths.map(async (path) => {
            try {
                return (await this.blobService.createSasUrl(path, '', 'read')).url;
            }
            catch {
                return path;
            }
        }));
        return { ...item, imagePaths: paths, images: paths, imageUrls };
    }
    async findAll(query) {
        const filter = {};
        if (!query.search) {
            filter.status = 'published';
        }
        if (query.search) {
            const re = new RegExp(query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            filter.$or = [{ name: re }, { sku: re }, { shortDescription: re }];
        }
        if (query.sareeType) {
            const sareeType = /^[a-f\d]{24}$/i.test(query.sareeType)
                ? { _id: query.sareeType }
                : { slug: query.sareeType, type: 'saree_type', isActive: true };
            const sareeTypeCategory = await this.categoryModel.findOne(sareeType).select('_id');
            filter.sareeType = sareeTypeCategory?._id || { $in: [] };
        }
        if (query.fabric)
            filter.fabric = query.fabric;
        if (query.occasion) {
            const occasion = /^[a-f\d]{24}$/i.test(query.occasion)
                ? { _id: query.occasion }
                : { slug: query.occasion, type: 'occasion', isActive: true };
            const occasionCategory = await this.categoryModel.findOne(occasion).select('_id');
            filter.occasions = occasionCategory?._id || { $in: [] };
        }
        if (query.colour)
            filter.colour = query.colour;
        if (query.workIntensity)
            filter.workIntensity = query.workIntensity;
        if (query.isNewArrival === 'true')
            filter.isNewArrival = true;
        if (query.isBestSeller === 'true')
            filter.isBestSeller = true;
        if (query.inStockOnly === 'true')
            filter.stockStatus = { $ne: product_status_enum_1.StockStatus.OUT_OF_STOCK };
        if (query.discountedOnly === 'true')
            filter.discountPrice = { $gt: 0 };
        if (query.minPrice || query.maxPrice) {
            filter.sellingPrice = {};
            if (query.minPrice)
                filter.sellingPrice.$gte = Number(query.minPrice);
            if (query.maxPrice)
                filter.sellingPrice.$lte = Number(query.maxPrice);
        }
        const sortMap = {
            featured: { isBestSeller: -1, createdAt: -1 },
            newest: { createdAt: -1 },
            price_asc: { sellingPrice: 1 },
            price_desc: { sellingPrice: -1 },
            best_selling: { isBestSeller: -1 },
            rating: { createdAt: -1 },
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
    async findRelated(id, limit = 4) {
        const product = await this.productModel.findById(id).select('sareeType occasions');
        if (!product)
            throw new common_1.NotFoundException('Product not found');
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
    async findOne(id) {
        const product = await this.productModel
            .findById(id)
            .populate('sareeType occasions collections');
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return this.withImageUrls(product);
    }
    async update(id, dto, userId) {
        const product = await this.productModel.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const changedFields = Object.keys(dto);
        Object.assign(product, dto, { updatedBy: userId });
        product.stockStatus = this.computeStockStatus(product);
        await product.save();
        await this.auditLogService.record(userId, 'PRODUCT_UPDATED', 'Product', id, {
            changedFields,
        });
        return product;
    }
    async remove(id) {
        const product = await this.productModel.findByIdAndUpdate(id, { status: 'archived' }, { new: true });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async adjustStock(id, changeQuantity, reason, userId) {
        const product = await this.productModel.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        product.availableQuantity = Math.max(0, product.availableQuantity + changeQuantity);
        product.stockStatus = this.computeStockStatus(product);
        product.updatedBy = userId;
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
    async decrementForOrder(productId, quantity) {
        const product = await this.productModel.findOneAndUpdate({ _id: productId, availableQuantity: { $gte: quantity } }, { $inc: { availableQuantity: -quantity } }, { new: true });
        if (!product)
            return null;
        product.stockStatus = this.computeStockStatus(product);
        await product.save();
        return product;
    }
    async restockForCancellation(productId, quantity) {
        const product = await this.productModel.findById(productId);
        if (!product)
            return null;
        product.availableQuantity += quantity;
        product.stockStatus = this.computeStockStatus(product);
        await product.save();
        return product;
    }
    async exportInventory() {
        const products = await this.productModel.find().select('sku name availableQuantity lowStockThreshold stockStatus sellingPrice status').lean();
        return (0, export_1.convertToCSV)(products);
    }
    async importInventory(csv, userId) {
        const rows = (0, export_1.parseCSV)(csv);
        if (!rows.length)
            throw new Error('CSV must contain at least one inventory row');
        const results = [];
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(stock_movement_schema_1.StockMovement.name)),
    __param(2, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        audit_log_service_1.AuditLogService,
        blob_service_1.BlobService,
        notification_gateway_1.NotificationGateway])
], ProductsService);
//# sourceMappingURL=products.service.js.map