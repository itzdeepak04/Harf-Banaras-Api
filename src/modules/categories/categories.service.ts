import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../../database/schemas/category.schema';
import { CategoriesAbstract } from './categories.abstract';

@Injectable()
export class CategoriesService implements CategoriesAbstract {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  private slugify(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async create(dto: any) {
    const slug = dto.slug || this.slugify(dto.name);
    return this.categoryModel.create({ ...dto, slug });
  }

  async findAll(type?: string) {
    const filter: any = { isActive: true };
    if (type) filter.type = type;
    return this.categoryModel.find(filter).sort({ sortOrder: 1 });
  }

  async update(id: string, dto: any) {
    const category = await this.categoryModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async remove(id: string) {
    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
