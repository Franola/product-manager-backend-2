const express = require("express");
const app = express();
const PORT = 8080;

const ProductManager = require("./ProductManager");
const productManager = new ProductManager();
const CartManager = require("./CartManager");
const cartManager = new CartManager();

app.use(express.json());

// Rutas para Manejo de Productos

// Debe listar todos los productos de la base de datos.
app.get("/api/products", (req, res) => {
    productManager.obtenerProductos().then((products) => {
        res.json(products);
    }).catch((error) => {
        res.status(500).json({ error: "Error al obtener los productos" });
    });
});

// Debe traer solo el producto con el id proporcionado.
app.get("/api/products/:pid", (req, res) => {
    const pid = parseInt(req.params.pid);
    productManager.obtenerProductos().then((products) => {
        const product = products.find(p => p.id === pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    }).catch((error) => {
        res.status(500).json({ error: "Error al obtener el producto" });
    });
});

// Debe agregar un nuevo producto
app.post("/api/products", (req, res) => {
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

// Debe actualizar un producto por los campos enviados desde el body.
app.put("/api/products/:pid", (req, res) => {
    const pid = parseInt(req.params.pid);
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

// Debe eliminar el producto con el pid indicado.
app.delete("/api/products/:pid", (req, res) => {
    const pid = parseInt(req.params.pid);
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


// Rutas para Manejo de Carritos

// Debe crear un nuevo carrito
app.post("/api/carts", (req, res) => {
    cartManager.crearCarrito().then((nuevoCarrito) => {
        res.status(201).json(nuevoCarrito);
    }).catch((error) => {
        res.status(500).json({ error: "Error al crear el carrito" });
    });
});

// Debe listar los productos que pertenecen al carrito con el cid proporcionado.
app.get("/api/carts/:cid", (req, res) => {
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

// Debe agregar el producto al arreglo products del carrito seleccionado
// Si un producto ya existente intenta agregarse, se debe incrementar el campo quantity de dicho producto.
app.post("/api/carts/:cid/products/:pid", (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    cartManager.agregarProductoAlCarrito(cid, pid).then((productoAgregado) => {
        res.status(201).json(productoAgregado);
    }).catch((error) => {
        res.status(500).json({ error: "Error al agregar el producto al carrito: " + error.message });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor express escuchando en el puerto: ${PORT}`);
});