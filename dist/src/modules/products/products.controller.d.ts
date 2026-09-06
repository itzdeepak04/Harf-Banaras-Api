import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { AuthenticatedUser } from '../../core/interfaces/authenticated-user.interface';
import { BlobService } from '../../core/blob/blob.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly blobService;
    constructor(productsService: ProductsService, blobService: BlobService);
    createImageSas(dto: {
        path: string;
        contentType: string;
        mode: 'upload' | 'read';
    }): Promise<import("../../shared/appresponse.shared").AppResponse<{
        path: string;
        url: string;
        expiresOn: Date;
    }>>;
    exportInventory(response: any): Promise<any>;
    importInventory(dto: {
        csv: string;
    }, user: AuthenticatedUser): Promise<import("../../shared/appresponse.shared").AppResponse<{
        sku: string;
        updated: boolean;
        message?: string;
    }[]>>;
    findAll(query: ProductQueryDto): Promise<import("../../shared/appresponse.shared").AppResponse<{
        items: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>>;
    search(query: ProductQueryDto): Promise<import("../../shared/appresponse.shared").AppResponse<{
        items: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>>;
    findOne(id: string): Promise<import("../../shared/appresponse.shared").AppResponse<any>>;
    findRelated(id: string, limit?: string): Promise<import("../../shared/appresponse.shared").AppResponse<any[]>>;
    create(dto: any, user: AuthenticatedUser): Promise<import("../../shared/appresponse.shared").AppResponse<any>>;
    update(id: string, dto: any, user: AuthenticatedUser): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").ProductDocument, {}, {}> & import("../../database/schemas").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    remove(id: string): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").ProductDocument, {}, {}> & import("../../database/schemas").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    adjustStock(id: string, dto: {
        changeQuantity: number;
        reason: string;
    }, user: AuthenticatedUser): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").ProductDocument, {}, {}> & import("../../database/schemas").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
}
