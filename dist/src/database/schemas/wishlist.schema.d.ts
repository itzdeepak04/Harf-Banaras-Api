import { Document, Types } from 'mongoose';
export type WishlistDocument = Wishlist & Document;
export declare class Wishlist {
    user: Types.ObjectId;
    products: Types.ObjectId[];
}
export declare const WishlistSchema: import("mongoose").Schema<Wishlist, import("mongoose").Model<Wishlist, any, any, any, Document<unknown, any, Wishlist, any, {}> & Wishlist & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Wishlist, Document<unknown, {}, import("mongoose").FlatRecord<Wishlist>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Wishlist> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
