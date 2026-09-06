import { Document, Types } from 'mongoose';
import { Role } from '../../core/enums/role.enum';
export type UserDocument = User & Document;
export declare class Address {
    label: string;
    fullName: string;
    phone: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}
export declare const AddressSchema: import("mongoose").Schema<Address, import("mongoose").Model<Address, any, any, any, Document<unknown, any, Address, any, {}> & Address & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Address, Document<unknown, {}, import("mongoose").FlatRecord<Address>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Address> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class User {
    name: string;
    email: string;
    mobile: string;
    passwordHash: string;
    role: Role;
    isActive: boolean;
    addresses: Address[];
    createdBy: Types.ObjectId | null;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
