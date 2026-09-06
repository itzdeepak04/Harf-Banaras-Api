import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { AuthAbstract } from './auth.abstract';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { Role } from '../../core/enums/role.enum';
import { MESSAGES } from '../../shared/messages.shared';

@Injectable()
export class AuthService implements AuthAbstract {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  private isEmail(identifier: string): boolean {
    return identifier.includes('@');
  }

  private signToken(user: UserDocument) {
    return this.jwtService.sign({
      sub: user._id,
      email: user.email,
      role: user.role,
    });
  }

  private toSafeUser(user: UserDocument) {
    const obj: any = user.toObject();
    delete obj.passwordHash;
    delete obj.resetPasswordToken;
    return obj;
  }

  async register(dto: RegisterDto) {
    const identifierQueries = [
      dto.email ? { email: dto.email.toLowerCase().trim() } : null,
      dto.mobile ? { mobile: dto.mobile.trim() } : null,
    ].filter(Boolean);
    const existing = await this.userModel.findOne({ $or: identifierQueries });
    if (existing) throw new ConflictException(MESSAGES.AUTH.USER_EXISTS);

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email?.toLowerCase(),
      mobile: dto.mobile,
      passwordHash,
      role: Role.CUSTOMER,
    });

    const token = this.signToken(user);
    return { token, user: this.toSafeUser(user) };
  }

  async login(dto: LoginDto) {
    const query = this.isEmail(dto.identifier)
      ? { email: dto.identifier.toLowerCase() }
      : { mobile: dto.identifier };

    const user = await this.userModel.findOne(query);
    if (!user || !user.isActive) {
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);

    const token = this.signToken(user);
    return { token, user: this.toSafeUser(user) };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const query = this.isEmail(dto.identifier)
      ? { email: dto.identifier.toLowerCase() }
      : { mobile: dto.identifier };
    const user = await this.userModel.findOne(query);
    // Do not reveal whether the account exists
    if (!user) return { message: 'If the account exists, reset instructions were sent' };

    const token = uuidv4();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    await user.save();

    // NOTE: integrate email/SMS provider here to actually deliver the token.
    return { message: 'If the account exists, reset instructions were sent', devToken: token };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      resetPasswordToken: dto.token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) throw new UnauthorizedException('Reset token is invalid or expired');

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    return { message: 'Password reset successfully' };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    return { message: 'Password changed successfully' };
  }

  // Used by Admin to create staff accounts (inventory managers / other admins)
  async createStaffAccount(
    creatorId: string,
    name: string,
    email: string,
    password: string,
    role: Role,
  ) {
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new ConflictException(MESSAGES.AUTH.USER_EXISTS);
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      createdBy: creatorId,
    });
    return this.toSafeUser(user);
  }
}
