import { Document, Types } from 'mongoose';
export type StockMovementDocument = StockMovement & Document;
export declare class StockMovement {
    product: Types.ObjectId;
    changeQuantity: number;
    reason: string;
    performedBy: Types.ObjectId;
}
export declare const StockMovementSchema: import("mongoose").Schema<StockMovement, import("mongoose").Model<StockMovement, any, any, any, Document<unknown, any, StockMovement, any, {}> & StockMovement & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StockMovement, Document<unknown, {}, import("mongoose").FlatRecord<StockMovement>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<StockMovement> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
