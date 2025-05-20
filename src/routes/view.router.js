const express = require("express");

const router = express.Router();

const ProductManager = require("../ProductManager");
const productManager = new ProductManager();

router.get("/", (req, res) => {
    res.render("index", {});
});

router.get("/home", (req, res) => {
    productManager.obtenerProductos().then((products) => {
        console.log(products);
        res.render("home", {products});
    }).catch((error) => {
        res.status(500).json({ error: "Error al obtener los productos" });
    });
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", {});
});

module.exports = router;