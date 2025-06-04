import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import uploader from "./utils.js";
import handlebars from "express-handlebars";
import path from "path";
import viewRouter from "./routes/view.router.js";
import { Server } from "socket.io";
import ProductManager from "./ProductManager.js";
import http from "http";

dotenv.config();

const app = express();
const PORT = 8080;

const productManager = new ProductManager();

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "src", "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "src", "public")));

const Http = http.createServer(app);
const io = new Server(Http);

const URL_MONGO = process.env.MONGO_URI;

mongoose.connect(URL_MONGO, {
    dbName: "CoderApp",
}).then(() => {
    console.log("Conectado a la base de datos MongoDB");
}).catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
});

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

Http.listen(8080, () => {
  console.log(`App corriendo en puerto ${PORT}`);
});