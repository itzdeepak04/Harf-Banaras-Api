import { ProductQueryDto } from './dto/product-query.dto';

export abstract class ProductsAbstract {
  abstract create(dto: any, userId: string): Promise<any>;
  abstract findAll(query: ProductQueryDto): Promise<any>;
  abstract findOne(id: string): Promise<any>;
  abstract update(id: string, dto: any, userId: string): Promise<any>;
  abstract remove(id: string): Promise<any>;
  abstract adjustStock(
    id: string,
    changeQuantity: number,
    reason: string,
    userId: string,
  ): Promise<any>;
}
