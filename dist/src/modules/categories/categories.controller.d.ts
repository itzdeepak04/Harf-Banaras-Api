import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(type?: string): Promise<import("../../shared/appresponse.shared").AppResponse<(import("mongoose").Document<unknown, {}, import("../../database/schemas").CategoryDocument, {}, {}> & import("../../database/schemas").Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>>;
    create(dto: any): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").CategoryDocument, {}, {}> & import("../../database/schemas").Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    update(id: string, dto: any): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").CategoryDocument, {}, {}> & import("../../database/schemas").Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    remove(id: string): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").CategoryDocument, {}, {}> & import("../../database/schemas").Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
}
