import { usersDAO } from "../dao/usersDAO.js";
import { UserDTO } from "../dto/UserDTO.js";

class UserRepository {
    #usersDAO;
    constructor() {
        this.#usersDAO = usersDAO;
    }

    async getUsers() {
        let users = await this.#usersDAO.get();
        return users.map(user => new UserDTO(user));
    }

    async getUserById(id) {
        let user = await this.#usersDAO.getById(id);
        return user ? new UserDTO(user) : null;
    }

    async getUserByEmail(email) {
        return await this.#usersDAO.getByEmail(email);
    }

    async createUser(user) {
        let newUser = await this.#usersDAO.create(user);
        return newUser ? new UserDTO(newUser) : null;
    }

    async updateUser(email, user) {
        let updatedUser = await this.#usersDAO.update(email, user);
        return updatedUser ? new UserDTO(updatedUser) : null;
    }

    async deleteUser(email) {
        let deletedUser = await this.#usersDAO.delete(email);
        return deletedUser ? new UserDTO(deletedUser) : null;
    }
}

export const userService = new UserRepository();