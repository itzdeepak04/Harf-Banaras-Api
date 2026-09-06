"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBAbstractRepository = void 0;
class MongoDBAbstractRepository {
    constructor(model) {
        this.model = model;
    }
    async create(createDto) {
        const document = new this.model(createDto);
        return document.save();
    }
    async findAll() {
        return this.model.find().exec();
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async update(id, updateDto) {
        return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    }
    async delete(id) {
        const result = await this.model.findByIdAndDelete(id).exec();
        return !!result;
    }
    async findByQuery(query) {
        return this.model.find(query).exec();
    }
    async countByQuery(query) {
        return this.model.countDocuments(query).exec();
    }
    async paginate(query, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const data = await this.model.find(query).skip(skip).limit(limit).exec();
        const total = await this.model.countDocuments(query).exec();
        return { data, total, page, limit };
    }
}
exports.MongoDBAbstractRepository = MongoDBAbstractRepository;
//# sourceMappingURL=index.js.map