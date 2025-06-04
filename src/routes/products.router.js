import express from "express";
import ProductManager from "../ProductManager.js";
const router = express.Router();

const productManager = new ProductManager();

router.get("/", (req, res) => {
    const { limit = 10, page = 1, sort = "", query = "" } = req.query;

    productManager.obtenerProductosPaginados(limit, page, sort, query).then((products) => {
        res.json(products);
    }).catch((error) => {
        res.status(500).json({ error: "Error al obtener los productos" });
    });
});

router.get("/:pid", (req, res) => {
    const pid = req.params.pid; 

    productManager.obtenerProductoPorId(pid).then((product) => {
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    }).catch((error) => {
        res.status(500).json({ error: "Error al obtener el producto" });
    });
});

router.post("/", (req, res) => {
    const newProduct = req.body;

    if(!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.status || !newProduct.stock || !newProduct.category) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    productManager.agregarProducto(newProduct).then((productoAgregado) => {
        res.status(201).json(productoAgregado);
    }).catch((error) => {
        res.status(500).json({ error: "Error al agregar el producto" });
    });
});

router.put("/:pid", (req, res) => {
    const pid = req.params.pid;
    const updatedProduct = req.body;

    if(!updatedProduct.title || !updatedProduct.description || !updatedProduct.code || !updatedProduct.price || !updatedProduct.status || !updatedProduct.stock || !updatedProduct.category) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    productManager.actualizarProducto(pid, updatedProduct).then((productoActualizado) => {
        if (productoActualizado) {
            res.json(productoActualizado);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    }).catch((error) => {
        res.status(500).json({ error: "Error al actualizar el producto" });
    });
});

router.delete("/:pid", (req, res) => {
    const pid = req.params.pid;
    productManager.eliminarProducto(pid).then((productoEliminado) => {
        if (productoEliminado) {
            res.json(productoEliminado);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    }).catch((error) => {
        res.status(500).json({ error: "Error al eliminar el producto" });
    });
});

export default router;