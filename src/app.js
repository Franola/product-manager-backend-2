const express = require("express");
const app = express();
const PORT = 8080;
const uploader = require("./utils");
const handlebars = require("express-handlebars");
const path = require("path");
const viewRouter = require("./routes/view.router");
const { Server } = require("socket.io");

const ProductManager = require("./ProductManager");
const productManager = new ProductManager();

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const http = require("http").createServer(app);
const io = new Server(http);

app.use("/view", viewRouter);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

io.on("connection", (socket) => {
    console.log("cliente conectado");

    socket.on("addProduct", (data) => {
        console.log(data);

        productManager.agregarProducto(data).then((productoAgregado) => {
            console.log("Producto agregado:", productoAgregado);
            io.emit("productAdded", productoAgregado);
        }).catch((error) => {
            console.error("Error al agregar el producto:", error);
        });
    });

    socket.on("deleteProduct", (data) => {
        console.log(data);
        productManager.eliminarProducto(data.id).then((productoEliminado) => {
            console.log("Producto eliminado:", productoEliminado);
            io.emit("productDeleted", productoEliminado);
        }).catch((error) => {
            console.error("Error al eliminar el producto:", error);
        });
    });

});

app.post("/upload", uploader.single("file"), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send("No se subió ninguna imagen.");
    }
    res.send("Archivo subido correctamente");
});

http.listen(8080, () => {
  console.log(`App corriendo en puerto ${PORT}`);
});