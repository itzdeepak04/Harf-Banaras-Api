import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../database/schemas/product.schema';
import { StockMovementDocument } from '../../database/schemas/stock-movement.schema';
import { ProductsAbstract } from './products.abstract';
import { ProductQueryDto } from './dto/product-query.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CategoryDocument } from '../../database/schemas/category.schema';
import { BlobService } from '../../core/blob/blob.service';
export declare class ProductsService implements ProductsAbstract {
    private productModel;
    private stockMovementModel;
    private categoryModel;
    private readonly auditLogService;
    private readonly blobService;
    constructor(productModel: Model<ProductDocument>, stockMovementModel: Model<StockMovementDocument>, categoryModel: Model<CategoryDocument>, auditLogService: AuditLogService, blobService: BlobService);
    private computeStockStatus;
    private generateUniqueSku;
    create(dto: any, userId: string): Promise<any>;
    private resolveCategory;
    private resolveCategories;
    private withImageUrls;
    findAll(query: ProductQueryDto): Promise<{
        items: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findRelated(id: string, limit?: number): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: any, userId: string): Promise<import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    adjustStock(id: string, changeQuantity: number, reason: string, userId: string): Promise<import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    decrementForOrder(productId: string, quantity: number): Promise<import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    restockForCancellation(productId: string, quantity: number): Promise<import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    exportInventory(): Promise<string>;
    importInventory(csv: string, userId: string): Promise<{
        sku: string;
        updated: boolean;
        message?: string;
    }[]>;
}
