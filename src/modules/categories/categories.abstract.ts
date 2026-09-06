export abstract class CategoriesAbstract {
  abstract create(dto: any, userId: string): Promise<any>;
  abstract findAll(type?: string): Promise<any>;
  abstract update(id: string, dto: any): Promise<any>;
  abstract remove(id: string): Promise<any>;
}
