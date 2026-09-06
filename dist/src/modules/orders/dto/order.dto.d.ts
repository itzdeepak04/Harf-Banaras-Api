import { OrderStatus } from '../../../core/enums/order-status.enum';
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
    note?: string;
}
