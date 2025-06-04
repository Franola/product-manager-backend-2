import express from "express"
import CartManager from "../CartManager.js";
const router = express.Router();

const cartManager = new CartManager();


router.post("/", (req, res) => {
    cartManager.crearCarrito().then((nuevoCarrito) => {
        res.status(201).json(nuevoCarrito);
    }).catch((error) => {
        res.status(500).json({ error: "Error al crear el carrito" });
    });
});

router.get("/:cid", (req, res) => {
    const cid = req.params.cid;

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
    const cid = req.params.cid;
    const pid = req.params.pid;

    cartManager.agregarProductoAlCarrito(cid, pid).then((productoAgregado) => {
        res.status(201).json(productoAgregado);
    }).catch((error) => {
        res.status(500).json({ error: "Error al agregar el producto al carrito: " + error.message });
    });
});

router.delete("/:cid/products/:pid", (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    cartManager.eliminarProductoDelCarrito(cid, pid).then((carrito) => {
        res.status(201).json(carrito);
    }).catch((error) => {
        res.status(500).json({ error: "Error al eliminar el producto del carrito: " + error.message });
    });
});

router.put("/:cid", (req, res) => {
    const cid = req.params.cid;
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un arreglo de productos" });
    }

    cartManager.actualizarProductosCarrito(cid, products).then((carritoActualizado) => {
        res.status(200).json(carritoActualizado);
    }).catch((error) => {
        res.status(500).json({ error: "Error al actualizar el carrito: " + error.message });
    });
});

router.put("/:cid/products/:pid", (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un número positivo" });
    }

    cartManager.actualizarCantidadProductoCarrito(cid, pid, quantity).then((carritoActualizado) => {
        res.status(200).json(carritoActualizado);
    }).catch((error) => {
        res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito: " + error.message });
    });
});

router.delete("/:cid", (req, res) => {
    const cid = req.params.cid;
    
    cartManager.vaciarCarrito(cid).then((carritoActualizado) => {
        res.status(200).json(carritoActualizado);
    }).catch((error) => {
        res.status(500).json({ error: "Error al eliminar el carrito: " + error.message });
    });
});

export default router;