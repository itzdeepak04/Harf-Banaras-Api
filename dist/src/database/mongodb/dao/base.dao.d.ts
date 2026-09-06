import { Model, Document } from 'mongoose';
export declare class BaseDAO<T extends Document> {
    protected readonly model: Model<T>;
    constructor(model: Model<T>);
    create(data: any): Promise<T>;
    findOne(query: any): Promise<T | null>;
    find(query: any, options?: any): Promise<T[]>;
    updateOne(query: any, update: any): Promise<T | null>;
    updateMany(query: any, update: any): Promise<any>;
    deleteOne(query: any): Promise<any>;
    deleteMany(query: any): Promise<any>;
    count(query: any): Promise<number>;
}
