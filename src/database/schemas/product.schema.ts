import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductStatus, StockStatus } from '../../core/enums/product-status.enum';

export type ProductDocument = Product & Document;

@Schema({ _id: false })
export class BlousePiece {
  @Prop({ default: false }) included: boolean;
  @Prop({ default: '' }) fabric: string;
  @Prop({ default: '' }) length: string;
}
export const BlousePieceSchema = SchemaFactory.createForClass(BlousePiece);

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true }) sku: string;
  @Prop({ required: true }) name: string;
  @Prop({ default: '' }) shortDescription: string;
  @Prop({ default: '' }) fullDescription: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' }) sareeType: Types.ObjectId;
  @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
  occasions: Types.ObjectId[];
  @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
  collections: Types.ObjectId[];

  @Prop({ default: '' }) fabric: string;
  @Prop({ default: '' }) weave: string;
  @Prop({ default: '' }) workType: string;
  @Prop({ default: '' }) colour: string;
  @Prop({ default: '' }) pattern: string;
  @Prop({ default: '' }) zariDetails: string;
  @Prop({ enum: ['light', 'medium', 'heavy'], default: 'medium' })
  workIntensity: string;

  @Prop({ default: '' }) sareeLength: string;
  @Prop({ default: '' }) sareeWidth: string;
  @Prop({ type: BlousePieceSchema, default: () => ({}) })
  blousePiece: BlousePiece;
  @Prop({ default: 0 }) weightGrams: number;

  @Prop({ required: true }) costPrice: number;
  @Prop({ required: true }) sellingPrice: number;
  @Prop({ default: 0 }) discountPrice: number;

  @Prop({ default: 0 }) availableQuantity: number;
  @Prop({ default: 3 }) lowStockThreshold: number;
  @Prop({ type: String, enum: StockStatus, default: StockStatus.OUT_OF_STOCK })
  stockStatus: StockStatus;

  @Prop({ type: [String], default: [] }) images: string[];
  @Prop({ type: [String], default: [] }) imagePaths: string[];
  @Prop({ type: [String], default: [] }) imageUrls: string[];
  @Prop({ default: '' }) videoUrl: string;
  @Prop({ type: [String], default: [] }) tags: string[];

  @Prop({ default: '' }) certificationInfo: string;
  @Prop({ default: '' }) weaverInfo: string;
  @Prop({ default: '' }) careInstructions: string;
  @Prop({ default: '2-4 business days' }) dispatchTime: string;

  @Prop({ type: String, enum: ProductStatus, default: ProductStatus.DRAFT })
  status: ProductStatus;

  @Prop({ default: false }) isBestSeller: boolean;
  @Prop({ default: false }) isNewArrival: boolean;
  @Prop({ default: false }) isLimitedEdition: boolean;

  @Prop({ default: '' }) seoTitle: string;
  @Prop({ default: '' }) seoDescription: string;

  @Prop({ type: Types.ObjectId, ref: 'User' }) createdBy: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User' }) updatedBy: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ sku: 1 }, { unique: true });
ProductSchema.index({ name: 'text', shortDescription: 'text', tags: 'text' });
