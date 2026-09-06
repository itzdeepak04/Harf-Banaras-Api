import { Model, Document } from 'mongoose';

/**
 * Base DAO for MongoDB operations
 */
export class BaseDAO<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: any): Promise<T> {
    return this.model.create(data);
  }

  async findOne(query: any): Promise<T | null> {
    return (await this.model.findOne(query).lean().exec()) as T | null;
  }

  async find(query: any, options?: any): Promise<T[]> {
    return (await this.model.find(query, {}, options).lean().exec()) as T[];
  }

  async updateOne(query: any, update: any): Promise<T | null> {
    return (await this.model
      .findOneAndUpdate(query, update, { new: true })
      .lean()
      .exec()) as T | null;
  }

  async updateMany(query: any, update: any): Promise<any> {
    return this.model.updateMany(query, update).exec();
  }

  async deleteOne(query: any): Promise<any> {
    return this.model.deleteOne(query).exec();
  }

  async deleteMany(query: any): Promise<any> {
    return this.model.deleteMany(query).exec();
  }

  async count(query: any): Promise<number> {
    return this.model.countDocuments(query).exec();
  }
}
