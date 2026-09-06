import { Model, Document } from 'mongoose';

/**
 * Abstract Repository Pattern for MongoDB
 */
export abstract class MongoDBAbstractRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(createDto: any): Promise<T> {
    const document = new this.model(createDto);
    return document.save();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async update(id: string, updateDto: any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findByQuery(query: any): Promise<T[]> {
    return this.model.find(query).exec();
  }

  async countByQuery(query: any): Promise<number> {
    return this.model.countDocuments(query).exec();
  }

  async paginate(
    query: any,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const data = await this.model.find(query).skip(skip).limit(limit).exec();
    const total = await this.model.countDocuments(query).exec();

    return { data, total, page, limit };
  }
}
