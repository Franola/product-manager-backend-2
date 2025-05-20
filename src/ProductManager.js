const fs = require("fs").promises;
const path = require("path");

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, "products.json");
    }

    async obtenerProductos() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            const products = JSON.parse(data);

            return products;
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            return [];
        }
    }

    async agregarProducto(producto) {
        try {
            const products = await this.obtenerProductos();
            const nuevoId = products.length ? products[products.length - 1].id + 1 : 1;
            producto.id = nuevoId;
            products.push(producto);
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return producto;
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    }

    async actualizarProducto(id, productoActualizado) {
        try {
            const products = await this.obtenerProductos();
            const index = products.findIndex((p) => p.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...productoActualizado };
                products[index].id = id;
                await fs.writeFile(this.path, JSON.stringify(products, null, 2));
                return products[index];
            } else {
                console.error("Producto no encontrado");
                return null;
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    }

    async eliminarProducto(id) {
        try {
            const products = await this.obtenerProductos();
            const index = products.findIndex((p) => p.id === id);
            if (index !== -1) {
                const productoEliminado = products.splice(index, 1)[0];
                await fs.writeFile(this.path, JSON.stringify(products, null, 2));
                return productoEliminado;
            } else {
                console.error("Producto no encontrado");
                return null;
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    }
}

module.exports = ProductManager;