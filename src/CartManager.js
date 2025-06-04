import { CartModel } from "./models/cart.model.js";
import ProductManager from "./ProductManager.js";

class CartManager{
    constructor() {
        this.path = "";
    }

    async crearCarrito() {
        try {
            const cart = {
                products: []
            };
            const newCart = await CartModel.create(cart);
            return newCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
        }
    }

    async obtenerProductosDelCarrito(cid){
        try {
            const cart = await CartModel.findById(cid).populate('products.product').lean();
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            const cartProducts = cart.products.map(item => ({
                product: item.product,
                quantity: item.quantity
            }));

            return cartProducts;
        }
        catch (error) {
            console.error("Error al obtener los productos del carrito:", error);
            return [];
        }
    }

    async agregarProductoAlCarrito(cid, pid) {
        try {
            const cart = await CartModel.findById(cid);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            
            const productManager = new ProductManager();
            const product = await productManager.obtenerProductoPorId(pid);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            
            const productInCart = cart.products.find(p => p.product.toString() === pid);
            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
            }
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            throw error;
        }
    }

    async eliminarProductoDelCarrito(cid, pid){
        try{
            const cart = await CartModel.findById(cid);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const productsfromCart = cart.products.filter(p => p.product.toString() !== pid);
            cart.products = productsfromCart;

            await cart.save();
            return cart;
        } catch(error){
            console.error("Error al agregar el producto al carrito:", error);
            throw error;
        }
    }

    async actualizarProductosCarrito(cid, products) {
        try {
            const cart = await CartModel.findById(cid);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            cart.products = products.map(product => ({
                product: product.product,
                quantity: product.quantity
            }));

            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al actualizar los productos del carrito:", error);
            throw error;
        }
    }

    async actualizarCantidadProductoCarrito(cid, pid, quantity) {
        try {
            const cart = await CartModel.findById(cid);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const productInCart = cart.products.find(p => p.product.toString() === pid);
            if (productInCart) {
                productInCart.quantity = quantity;
                await cart.save();
                return cart;
            } else {
                throw new Error("Producto no encontrado en el carrito");
            }
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            throw error;
        }
    }

    async vaciarCarrito(cid) {
        try {
            const cart = await CartModel.findById(cid);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            throw error;
        }
    }
}

export default CartManager;