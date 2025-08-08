import { ticketsDAO } from "../dao/ticketsDAO.js";
import { userService } from "./UserRepository.js";

class TicketRepository {
    #ticketsDAO;
    constructor() {
        this.#ticketsDAO = ticketsDAO;
    }

    async getTickets() {
        return await this.#ticketsDAO.get();
    }

    async getTicketById(id) {
        return await this.#ticketsDAO.getById(id);
    }

    async getTicketsByUserId(userId) {
        return await this.#ticketsDAO.getByUserId(userId);
    }

    async getTicketByCode(code) {
        return await this.#ticketsDAO.getByCode(code);
    }

    async createTicket(cart, user) {
        const purchaser = await userService.getUserByEmail(user.email);
        if (!purchaser) {
            return null;
        }

        const ticket = {
            code: `T-${Date.now()}`,
            purchaser: purchaser._id,
            products: cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            purchase_datetime: new Date(),
            total: cart.products.reduce((total, item) => total + (item.product.price * item.quantity), 0)
        };

        return await this.#ticketsDAO.create(ticket);
    }

    async updateTicket(id, ticket) {
        return await this.#ticketsDAO.update(id, ticket);
    }

    async deleteTicket(id) {
        return await this.#ticketsDAO.delete(id);
    }
}

export const ticketService = new TicketRepository();