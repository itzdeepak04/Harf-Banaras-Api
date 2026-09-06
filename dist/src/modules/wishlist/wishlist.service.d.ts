import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from '../../database/schemas/wishlist.schema';
export declare class WishlistService {
    private wishlistModel;
    constructor(wishlistModel: Model<WishlistDocument>);
    private getOrCreate;
    get(userId: string): Promise<Omit<import("mongoose").Document<unknown, {}, WishlistDocument, {}, {}> & Wishlist & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, never>>;
    add(userId: string, productId: string): Promise<Omit<import("mongoose").Document<unknown, {}, WishlistDocument, {}, {}> & Wishlist & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, never>>;
    remove(userId: string, productId: string): Promise<Omit<import("mongoose").Document<unknown, {}, WishlistDocument, {}, {}> & Wishlist & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, never>>;
}
