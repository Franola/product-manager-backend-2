import express from "express";
import ProductManager from "../ProductManager.js";
import CartManager from "../CartManager.js";
import { ProductModel } from "../models/product.model.js";
import passport from 'passport';

const router = express.Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", (req, res) => {
    res.render("index", {});
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/home", passport.authenticate("current", {session:false, failureRedirect:"/error"}), async (req, res) => {
    console.log("Usuario logueado:", req.user);

    const { page = 1, limit = 5 } = req.query;
    
    const result = await ProductModel.paginate({}, { page, limit, lean: true }); 

    res.render("home", {
        products: result.docs,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        totalPages: result.totalPages
    });
});

router.get("/product", async (req, res) => {
    const result = await productManager.obtenerProductoPorId(req.query.id);
    if (result) {
        res.render("product", { product: result });
    } else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", {});
});

router.get("/carts/:cid", (req, res) => {
    const cid = req.params.cid;
    cartManager.obtenerProductosDelCarrito(cid).then((products) => {
        if (products) {
            var total = 0;
            // calcular el total de productos
            products.forEach(product => {
                total += product.product.price * product.quantity;
            });
            res.render("cart", { products, cid, total });
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    }).catch((error) => {
        res.status(500).json({ error: "Error al obtener los productos del carrito" });
    });
});

export default router;