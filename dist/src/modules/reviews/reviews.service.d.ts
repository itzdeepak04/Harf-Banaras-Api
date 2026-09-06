import { Model } from 'mongoose';
import { Review, ReviewDocument } from '../../database/schemas/review.schema';
import { OrderDocument } from '../../database/schemas/order.schema';
export declare class ReviewsService {
    private reviewModel;
    private orderModel;
    constructor(reviewModel: Model<ReviewDocument>, orderModel: Model<OrderDocument>);
    create(userId: string, dto: {
        productId: string;
        orderId: string;
        rating: number;
        title?: string;
        comment?: string;
    }): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findForProduct(productId: string): Promise<(import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    moderate(id: string, status: 'approved' | 'rejected'): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
