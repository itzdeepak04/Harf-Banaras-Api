import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { UsersAbstract } from './users.abstract';
import { Role } from '../../core/enums/role.enum';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class UsersService implements UsersAbstract {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { name: dto.name } },
      { new: true },
    ).select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async addAddress(userId: string, dto: any) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (dto.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
    user.addresses.push(dto);
    await user.save();
    return user.addresses;
  }

  async removeAddress(userId: string, addressIndex: number) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    user.addresses.splice(addressIndex, 1);
    await user.save();
    return user.addresses;
  }

  // Admin only
  async listStaff() {
    return this.userModel
      .find({ role: { $in: [Role.ADMIN, Role.INVENTORY_MANAGER] } })
      .select('-passwordHash');
  }

  async setActive(userId: string, isActive: boolean, performedBy?: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true },
    ).select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');

    if (performedBy) {
      await this.auditLogService.record(
        performedBy,
        isActive ? 'STAFF_ACTIVATED' : 'STAFF_DEACTIVATED',
        'User',
        userId,
        { role: user.role },
      );
    }

    return user;
  }
}
