import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../../core/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ _id: false })
export class Address {
  @Prop() label: string;
  @Prop() fullName: string;
  @Prop() phone: string;
  @Prop() line1: string;
  @Prop() line2: string;
  @Prop() city: string;
  @Prop() state: string;
  @Prop() pincode: string;
  @Prop({ default: false }) isDefault: boolean;
}
export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true }) name: string;

  @Prop({ unique: true, sparse: true, lowercase: true, trim: true })
  email: string;

  @Prop({ unique: true, sparse: true, trim: true })
  mobile: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: String, enum: Role, default: Role.CUSTOMER })
  role: Role;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null; // for staff created by Admin

  @Prop({ default: null })
  resetPasswordToken: string | null;

  @Prop({ default: null })
  resetPasswordExpires: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
