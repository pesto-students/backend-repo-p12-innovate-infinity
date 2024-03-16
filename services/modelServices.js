import * as dotenv from "dotenv";
import db from "../dbconfig.js";
dotenv.config();
class ModelClass {
    constructor(modelName) {
        this.Model = db[modelName];
    }
    async createOne(data, transaction = null) {
        try {
            const result = await this.Model.create(data, { transaction });
            return result;
        } catch (error) {
            console.log("create one error");
            console.log(data);
            throw new Error(`Error creating ${this.Model.name}: ${error.message}`);
        }
    }
    async createBulk(data, transaction = null) {
        try {
            const result = await this.Model.bulkCreate(data, { transaction });
            return result;
        } catch (error) {
            console.log("bulk create error");
            throw new Error(`Error creating ${this.Model.name}: ${error.message}`);
        }
    }
    async findOne(condition) {
        try {
            const result = await this.Model.findOne(condition);
            return result;
        } catch (error) {
            throw new Error(`Error reading ${this.Model.name}: ${error.message}`);
        }
    }
    async findAll(condition = {}) {
        try {
            const result = await this.Model.findAll(condition);
            return result;
        } catch (error) {
            throw new Error(`Error reading ${this.Model.name}: ${error.message}`);
        }
    }
    async update(condition, data, transaction = null) {
        try {
            await this.Model.update(data, {
                where: condition,
                transaction,
            });
            const updatedRecord = await this.Model.findOne({
                where: condition,
            });
            return updatedRecord;
        } catch (error) {
            console.log("update error");
            console.log(condition);
            console.log(data);
            throw new Error(`Error creating ${this.Model.name}: ${error.message}`);
        }
    }
    async delete(condition, transaction = null) {
        try {
            const result = await this.Model.destroy({
                where: condition,
                transaction,
            });
            return result;
        } catch (error) {
            throw new Error(`Error deleting ${this.Model.name}: ${error.message}`);
        }
    }
}