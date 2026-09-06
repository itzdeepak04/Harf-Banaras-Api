import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../../database/schemas/category.schema';
import { CategoriesAbstract } from './categories.abstract';
export declare class CategoriesService implements CategoriesAbstract {
    private categoryModel;
    constructor(categoryModel: Model<CategoryDocument>);
    private slugify;
    create(dto: any): Promise<import("mongoose").Document<unknown, {}, CategoryDocument, {}, {}> & Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(type?: string): Promise<(import("mongoose").Document<unknown, {}, CategoryDocument, {}, {}> & Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    update(id: string, dto: any): Promise<import("mongoose").Document<unknown, {}, CategoryDocument, {}, {}> & Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, CategoryDocument, {}, {}> & Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
