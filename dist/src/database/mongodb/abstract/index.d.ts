import { Model, Document } from 'mongoose';
export declare abstract class MongoDBAbstractRepository<T extends Document> {
    protected readonly model: Model<T>;
    constructor(model: Model<T>);
    create(createDto: any): Promise<T>;
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    update(id: string, updateDto: any): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    findByQuery(query: any): Promise<T[]>;
    countByQuery(query: any): Promise<number>;
    paginate(query: any, page?: number, limit?: number): Promise<{
        data: T[];
        total: number;
        page: number;
        limit: number;
    }>;
}
