import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CouponType } from '../../../database/schemas/coupon.schema';

export class CreateCouponDto {
  @IsString() code: string;
  @IsEnum(CouponType) type: CouponType;
  @IsNumber() @Min(0) value: number;
  @IsOptional() @IsNumber() @Min(0) minOrderValue?: number;
  @IsOptional() @IsNumber() @Min(0) maxDiscount?: number;
  @IsDateString() expiresAt: string;
  @IsOptional() @IsNumber() @Min(0) usageLimit?: number;
  @IsOptional() @IsString() description?: string;
}

export class UpdateCouponDto {
  @IsOptional() @IsNumber() @Min(0) value?: number;
  @IsOptional() @IsNumber() @Min(0) minOrderValue?: number;
  @IsOptional() @IsNumber() @Min(0) maxDiscount?: number;
  @IsOptional() @IsDateString() expiresAt?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsNumber() @Min(0) usageLimit?: number;
  @IsOptional() @IsString() description?: string;
}

export class ValidateCouponDto {
  @IsString() code: string;
  @IsNumber() @Min(0) cartSubtotal: number;
}
