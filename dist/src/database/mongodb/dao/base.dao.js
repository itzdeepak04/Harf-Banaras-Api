"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDAO = void 0;
class BaseDAO {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return this.model.create(data);
    }
    async findOne(query) {
        return (await this.model.findOne(query).lean().exec());
    }
    async find(query, options) {
        return (await this.model.find(query, {}, options).lean().exec());
    }
    async updateOne(query, update) {
        return (await this.model
            .findOneAndUpdate(query, update, { new: true })
            .lean()
            .exec());
    }
    async updateMany(query, update) {
        return this.model.updateMany(query, update).exec();
    }
    async deleteOne(query) {
        return this.model.deleteOne(query).exec();
    }
    async deleteMany(query) {
        return this.model.deleteMany(query).exec();
    }
    async count(query) {
        return this.model.countDocuments(query).exec();
    }
}
exports.BaseDAO = BaseDAO;
//# sourceMappingURL=base.dao.js.map