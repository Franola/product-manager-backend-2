const express = require("express");
const router = express.Router();

const CartManager = require("../CartManager");
const cartManager = new CartManager();


router.post("/", (req, res) => {
    cartManager.crearCarrito().then((nuevoCarrito) => {
        res.status(201).json(nuevoCarrito);
    }).catch((error) => {
        res.status(500).json({ error: "Error al crear el carrito" });
    });
});

router.get("/:cid", (req, res) => {
    const cid = parseInt(req.params.cid);

    cartManager.obtenerProductosDelCarrito(cid).then((products) => {
        if (products) {
            res.json(products);
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    }).catch((error) => {
        res.status(500).json({ error: "Error al obtener los productos del carrito" });
    });
});

router.post("/:cid/products/:pid", (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    cartManager.agregarProductoAlCarrito(cid, pid).then((productoAgregado) => {
        res.status(201).json(productoAgregado);
    }).catch((error) => {
        res.status(500).json({ error: "Error al agregar el producto al carrito: " + error.message });
    });
});

module.exports = router;