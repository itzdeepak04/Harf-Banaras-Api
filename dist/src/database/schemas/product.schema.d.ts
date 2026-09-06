import { Document, Types } from 'mongoose';
import { ProductStatus, StockStatus } from '../../core/enums/product-status.enum';
export type ProductDocument = Product & Document;
export declare class BlousePiece {
    included: boolean;
    fabric: string;
    length: string;
}
export declare const BlousePieceSchema: import("mongoose").Schema<BlousePiece, import("mongoose").Model<BlousePiece, any, any, any, Document<unknown, any, BlousePiece, any, {}> & BlousePiece & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BlousePiece, Document<unknown, {}, import("mongoose").FlatRecord<BlousePiece>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<BlousePiece> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Product {
    sku: string;
    name: string;
    shortDescription: string;
    fullDescription: string;
    sareeType: Types.ObjectId;
    occasions: Types.ObjectId[];
    collections: Types.ObjectId[];
    fabric: string;
    weave: string;
    workType: string;
    colour: string;
    pattern: string;
    zariDetails: string;
    workIntensity: string;
    sareeLength: string;
    sareeWidth: string;
    blousePiece: BlousePiece;
    weightGrams: number;
    costPrice: number;
    sellingPrice: number;
    discountPrice: number;
    availableQuantity: number;
    lowStockThreshold: number;
    stockStatus: StockStatus;
    images: string[];
    imagePaths: string[];
    imageUrls: string[];
    videoUrl: string;
    tags: string[];
    certificationInfo: string;
    weaverInfo: string;
    careInstructions: string;
    dispatchTime: string;
    status: ProductStatus;
    isBestSeller: boolean;
    isNewArrival: boolean;
    isLimitedEdition: boolean;
    seoTitle: string;
    seoDescription: string;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product, any, {}> & Product & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Product> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
