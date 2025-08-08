import { TicketModel } from "../models/ticket.model.js";

class TicketsDAO {
    constructor(){}

    async get() {
        return await TicketModel.find().populate('products.product').populate('purchaser', 'first_name last_name email').lean();
    }

    async getById(id) {
        return await TicketModel.findById(id).populate('products.product').populate('purchaser', 'first_name last_name email').lean();
    }

    async getByUserId(userId) {
        return await TicketModel.find({ purchaser: userId }).populate('products.product').populate('purchaser', 'first_name last_name email').lean();
    }

    async getByCode(code) {
        return await TicketModel.findOne({ code }).populate('products.product').populate('purchaser', 'first_name last_name email').lean();
    }

    async create(ticket) {
        return await TicketModel.create(ticket);
    }

    async update(id, ticket) {
        return await TicketModel.findByIdAndUpdate(id, ticket, { new: true }).lean();
    }

    async delete(id) {
        return await TicketModel.findByIdAndDelete(id).lean();
    }
}

export const ticketsDAO = new TicketsDAO();