import { WishlistService } from './wishlist.service';
import { AuthenticatedUser } from '../../core/interfaces/authenticated-user.interface';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    get(user: AuthenticatedUser): Promise<import("../../shared/appresponse.shared").AppResponse<Omit<import("mongoose").Document<unknown, {}, import("../../database/schemas").WishlistDocument, {}, {}> & import("../../database/schemas").Wishlist & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, never>>>;
    add(user: AuthenticatedUser, productId: string): Promise<import("../../shared/appresponse.shared").AppResponse<Omit<import("mongoose").Document<unknown, {}, import("../../database/schemas").WishlistDocument, {}, {}> & import("../../database/schemas").Wishlist & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, never>>>;
    remove(user: AuthenticatedUser, productId: string): Promise<import("../../shared/appresponse.shared").AppResponse<Omit<import("mongoose").Document<unknown, {}, import("../../database/schemas").WishlistDocument, {}, {}> & import("../../database/schemas").Wishlist & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, never>>>;
}
