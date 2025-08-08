import { CartsDAO } from "../dao/cartsDAO.js";

class CartRepository {
    #cartsDAO;
    constructor() {
        this.#cartsDAO = new CartsDAO();
    }

    async getCarts() {
        return await this.#cartsDAO.get();
    }

    async getCartById(id) {
        return await this.#cartsDAO.getById(id);
    }

    async getCartWithProducts(id) {
        return await this.#cartsDAO.getByIdWithProducts(id);
    }

    async getCartProducts(id) {
        const cart = await this.#cartsDAO.getByIdWithProducts(id);
        if (!cart) {
            return null;
        }
        return cart.products;
    }

    async createCart() {
        const cart = {
            products: []
        };
        return await this.#cartsDAO.create(cart);
    }

    async addProductToCart(cartId, productId) {
        const cart = await this.#cartsDAO.getById(cartId);
        if (!cart) {
            return null;
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId.toString());

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        return await this.#cartsDAO.update(cartId, { 
            ...cart, 
            products: [...cart.products] 
        });
    }

    async updateProductsInCart(cartId, products) {
        const cart = await this.#cartsDAO.getById(cartId);
        if (!cart) {
            return null;
        }

        cart.products = products.map(product => ({
            product: product.product,
            quantity: product.quantity
        }));

        return await this.#cartsDAO.update(cartId, cart);
    }

    async updateProductQuantityInCart(cartId, productId, quantity) {
        const cart = await this.#cartsDAO.getById(cartId);
        if (!cart) {
            return null;
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId.toString());
        
        if (productIndex === -1) {
            cart.products.push({
                product: productId,
                quantity: quantity
            });
        }
        else{
            cart.products[productIndex].quantity += quantity;
        }

        return await this.#cartsDAO.update(cartId, cart);
    }

    async updateCart(id, cart) {
        return await this.#cartsDAO.update(id, cart);
    }

    async deleteProductFromCart(cartId, productId) {
        const cart = await this.#cartsDAO.getById(cartId);
        if (!cart) {
            return null;
        }

        cart.products = cart.products.filter(p => p.product.toString() !== productId.toString());

        return await this.#cartsDAO.update(cartId, cart);
    }

    async emptyCart(id) {
        const cart = await this.#cartsDAO.getById(id);
        if (!cart) {
            return null;
        }

        cart.products = [];
        return await this.#cartsDAO.update(id, cart);
    }

    async deleteCart(id) {
        return await this.#cartsDAO.delete(id);
    }
}

export const cartService = new CartRepository(CartsDAO);