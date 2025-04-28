const fs = require("fs").promises;
const path = require("path");
const ProductManager = require("./ProductManager");

class CartManager{
    constructor() {
        this.path = path.join(__dirname, "carts.json");
    }

    async crearCarrito() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            const carts = JSON.parse(data);
            const nuevoId = carts.length ? carts[carts.length - 1].id + 1 : 1;
            const nuevoCarrito = { id: nuevoId, products: [] };
            carts.push(nuevoCarrito);
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return nuevoCarrito;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
        }
    }

    async obtenerProductosDelCarrito(cid){
        try {
            const data = await fs.readFile(this.path, "utf-8");
            const carts = JSON.parse(data);
            const cart = carts.find(cart => cart.id === cid);
            if (!cart) {
                console.error("Carrito no encontrado");
                return null;
            }
            const productManager = new ProductManager();
            const products = await productManager.obtenerProductos();

            const cartProducts = cart.products.map(product => {
                const productData = products.find(p => p.id === product.id);
                return { ...productData, quantity: product.quantity };
            });

            return cartProducts;
        }
        catch (error) {
            console.error("Error al obtener los productos del carrito:", error);
            return [];
        }
    }

    async agregarProductoAlCarrito(cid, pid) {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            const carts = JSON.parse(data);
            const cart = carts.find(cart => cart.id === cid);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const productManager = new ProductManager();
            const products = await productManager.obtenerProductos();
            const product = products.find(p => p.id === pid);
            if (!product) {
                throw new Error("Producto no encontrado");
            }

            const productInCart = cart.products.find(p => p.id === pid);
            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cart.products.push({ id: pid, quantity: 1 });
            }
            
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return cart;
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            throw error;
        }
    }
}

module.exports = CartManager;