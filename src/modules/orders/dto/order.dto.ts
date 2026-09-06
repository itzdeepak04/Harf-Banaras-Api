import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../../../core/enums/order-status.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  note?: string;
}