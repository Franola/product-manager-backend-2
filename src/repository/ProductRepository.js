import { ProductsDAO } from "../dao/productsDAO.js";

class ProductRepository {
    #productsDAO;
    constructor() {
        this.#productsDAO = new ProductsDAO();
    }

    async getProducts() {
        return await this.#productsDAO.get();
    }

    async getProductsByFilter(filter = {}) {
        return await this.#productsDAO.getBy(filter);
    }

    async getProductById(id) {
        return await this.#productsDAO.getById(id);
    }
    
    async getProductsPaginated(limit, page, sort, query) {
        return await this.#productsDAO.getPaginate(limit, page, sort, query);
    }

    async createProduct(product) {
        return await this.#productsDAO.create(product);
    }

    async discountProductStock(id, quantity) {
        let product = await this.#productsDAO.getById(id);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        if (product.stock < quantity) {
            throw new Error("Stock insuficiente");
        }
        
        product.stock -= quantity;
        return await this.#productsDAO.update(id, product);
    }

    async updateProduct(id, product) {
        return await this.#productsDAO.update(id, product);
    }

    async deleteProduct(id) {
        return await this.#productsDAO.delete(id);
    }
}

export const productService = new ProductRepository(ProductsDAO);
