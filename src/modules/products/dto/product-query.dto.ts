import { IsIn, IsOptional, IsString } from 'class-validator';

export class ProductQueryDto {
  @IsOptional() @IsString()
  search?: string;
  @IsOptional() @IsString()
  sareeType?: string;
  @IsOptional() @IsString()
  fabric?: string;
  @IsOptional() @IsString()
  occasion?: string;
  @IsOptional() @IsString()
  colour?: string;
  @IsOptional() @IsString()
  workIntensity?: string;
  @IsOptional() @IsString()
  minPrice?: string;
  @IsOptional() @IsString()
  maxPrice?: string;
  @IsOptional() @IsString()
  inStockOnly?: string; // 'true' | 'false'
  @IsOptional() @IsString()
  isNewArrival?: string;
  @IsOptional() @IsString()
  isBestSeller?: string;
  @IsOptional() @IsString()
  discountedOnly?: string;
  @IsOptional() @IsIn(['featured', 'newest', 'price_asc', 'price_desc', 'best_selling', 'rating'])
  sort?:
    | 'featured'
    | 'newest'
    | 'price_asc'
    | 'price_desc'
    | 'best_selling'
    | 'rating';
  @IsOptional() @IsString()
  page?: string;
  @IsOptional() @IsString()
  limit?: string;
  @IsOptional() @IsString()
  pageSize?: string;
  @IsOptional() @IsString()
  pageLimit?: string;
}
