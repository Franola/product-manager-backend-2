import { cartService } from "../repository/CartRepository.js";
import { productService } from "../repository/ProductRepository.js";
import { ticketService } from "../repository/TicketRepository.js";

async function createCart(req, res){
    try{
        const newCart = await cartService.createCart();
        return res.status(201).json(newCart);    
    }
    catch(error){
        return res.status(500).json({
            error: "Error al crear el carrito"
        });
    }
}

async function getCartProducts(req, res){
    try{
        const cid = req.params.cid;
        if (!cid) {
            return res.status(400).json({ error: "ID de carrito no proporcionado" });
        }

        const cartProducts = await cartService.getCartProducts(cid);

        if (!cartProducts) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.status(200).json(cartProducts);
    }
    catch(error){
        return res.status(500).json({
            error: "Error al obtener los productos del carrito"
        });
    }
}

async function addProductToCart(req, res){
    try{
        const cid = req.params.cid;
        const pid = req.params.pid;
        if (!cid || !pid) {
            return res.status(400).json({ error: "ID de carrito o producto no proporcionado" });
        }

        const cart = await cartService.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const product = await productService.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        
        const updatedCart = await cartService.addProductToCart(cid, pid);
        if (!updatedCart) {
            return res.status(500).json({ error: "Error al agregar el producto al carrito" });
        }
        return res.status(201).json(updatedCart);
    }
    catch(error){
        return res.status(500).json({
            error: "Error al agregar el producto al carrito"
        });
    }
}

async function removeProductFromCart(req, res){
    try{
        const cid = req.params.cid;
        const pid = req.params.pid;
        if (!cid || !pid) {
            return res.status(400).json({ error: "ID de carrito o producto no proporcionado" });
        }

        const cart = await cartService.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        const product = await productService.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const cartProduct = cart.products.find(p => p.product.toString() === pid);
        if (!cartProduct) {
            return res.status(404).json({ error: "Producto no encontrado en el carrito" });
        }

        const updatedCart = await cartService.deleteProductFromCart(cid, pid);
        if (!updatedCart) {
            return res.status(500).json({ error: "Error al eliminar el producto del carrito" });
        }

        return res.status(200).json(updatedCart);
    }
    catch(error){
        return res.status(500).json({
            error: "Error al eliminar el producto del carrito"
        });
    }
}

async function updateProductsInCart(req, res){
    try{
        const cid = req.params.cid;
        const products = req.body;

        if (!cid) {
            return res.status(400).json({ error: "ID de carrito no proporcionado"});
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un arreglo de productos" });
        }

        const cart = await cartService.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        for (const product of products) {
            if (!product.product || typeof product.quantity !== 'number' || product.quantity <= 0) {
                return res.status(400).json({ error: "Cada producto debe tener un ID válido y una cantidad positiva" });
            }

            const prod = await productService.getProductById(product.product);
            if (!prod) {
                return res.status(404).json({ error: `Producto con ID ${product.product} no encontrado` });
            }
        }

        const updatedCart = await cartService.updateProductsInCart(cid, products);
        if (!updatedCart) {
            return res.status(500).json({ error: "Error al actualizar los productos del carrito" });
        }

        return res.status(200).json(updatedCart);
    }
    catch(error){
        return res.status(500).json({
            error: "Error al actualizar los productos del carrito"
        });
    }
}

async function updateProductQuantityInCart(req, res){
    try{
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;
        
        if (!cid || !pid) {
            return res.status(400).json({ error: "ID de carrito o producto no proporcionado" });
        }
        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ error: "La cantidad debe ser un número positivo" });
        }

        const cart = await cartService.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        const product = await productService.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const updatedCart = await cartService.updateProductQuantityInCart(cid, pid, quantity);
        if (!updatedCart) {
            return res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito" });
        }

        return res.status(200).json(updatedCart);
    }
    catch(error){
        return res.status(500).json({
            error: "Error al actualizar la cantidad del producto en el carrito"
        });
    }
}

async function emptyCart(req, res){
    try{
        const cid = req.params.cid;
        if (!cid) {
            return res.status(400).json({ error: "ID de carrito no proporcionado" });
        }

        const cart = await cartService.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const updatedCart = await cartService.emptyCart(cid);
        if (!updatedCart) {
            return res.status(500).json({ error: "Error al vaciar el carrito" });
        }
        
        return res.status(200).json(updatedCart);
    }
    catch(error){
        return res.status(500).json({
            error: "Error al vaciar el carrito"
        });
    }
}

async function purchaseCart(req, res){
    try{
        const cid = req.params.cid;
        if (!cid) {
            return res.status(400).json({ error: "ID de carrito no proporcionado" });
        }

        const cart = await cartService.getCartWithProducts(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        if (cart.products.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío" });
        }

        for (const item of cart.products) {
            const product = await productService.getProductById(item.product._id);
            if (!product) {
                return res.status(404).json({ error: `Producto con ID ${item.product._id} no encontrado` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Stock insuficiente para el producto ${product.name}` });
            }
        }

        const ticket = await ticketService.createTicket(cart, req.user);
        if (!ticket) {
            return res.status(500).json({ error: "Error al crear el ticket de compra" });
        }

        const updatedCart = await cartService.emptyCart(cid);
        if (!updatedCart) {
            return res.status(500).json({ error: "Error al vaciar el carrito" });
        }

        for (const item of cart.products) {
            await productService.discountProductStock(item.product._id, item.quantity);
        }

        return res.status(200).json(ticket);
    }
    catch(error){
        return res.status(500).json({
            error: "Error al procesar la compra del carrito"
        });
    }
}

export default {
    createCart,
    getCartProducts,
    addProductToCart,
    removeProductFromCart,
    updateProductsInCart,
    updateProductQuantityInCart,
    emptyCart,
    purchaseCart
};