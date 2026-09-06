import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from '../../database/schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
  ) {}

  private async getOrCreate(userId: string) {
    let wishlist = await this.wishlistModel.findOne({ user: userId });
    if (!wishlist) wishlist = await this.wishlistModel.create({ user: userId, products: [] });
    return wishlist;
  }

  async get(userId: string) {
    const wishlist = await this.getOrCreate(userId);
    return wishlist.populate('products');
  }

  async add(userId: string, productId: string) {
    const wishlist = await this.getOrCreate(userId);
    if (!wishlist.products.some((p) => p.toString() === productId)) {
      wishlist.products.push(productId as any);
      await wishlist.save();
    }
    return this.get(userId);
  }

  async remove(userId: string, productId: string) {
    const wishlist = await this.getOrCreate(userId);
    wishlist.products = wishlist.products.filter((p) => p.toString() !== productId) as any;
    await wishlist.save();
    return this.get(userId);
  }
}
