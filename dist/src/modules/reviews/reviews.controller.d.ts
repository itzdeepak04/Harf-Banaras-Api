import { ReviewsService } from './reviews.service';
import { AuthenticatedUser } from '../../core/interfaces/authenticated-user.interface';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findForProduct(productId: string): Promise<import("../../shared/appresponse.shared").AppResponse<(import("mongoose").Document<unknown, {}, import("../../database/schemas").ReviewDocument, {}, {}> & import("../../database/schemas").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>>;
    create(user: AuthenticatedUser, dto: any): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").ReviewDocument, {}, {}> & import("../../database/schemas").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    moderate(id: string, dto: {
        status: 'approved' | 'rejected';
    }): Promise<import("../../shared/appresponse.shared").AppResponse<import("mongoose").Document<unknown, {}, import("../../database/schemas").ReviewDocument, {}, {}> & import("../../database/schemas").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
}
