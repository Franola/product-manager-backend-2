import { UserModel } from "../models/user.model.js";

class UsersDAO {
    constructor(){}

    async get() {
        return await UserModel.find().lean();
    }

    async getById(id) {
        return await UserModel.findById(id).lean();
    }

    async getByEmail(email) {
        return await UserModel.findOne({ email }).lean();
    }

    async create(user) {
        return await UserModel.create(user);
    }

    async update(email, user) {
        return await UserModel.findOneAndUpdate({ email }, user, { new: true });
    }

    async delete(email) {
        return await UserModel.findOneAndDelete({ email }).lean();
    }
}

export const usersDAO = new UsersDAO();
