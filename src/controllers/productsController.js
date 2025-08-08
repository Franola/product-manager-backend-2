import { productService } from "../repository/ProductRepository.js";

async function getProductsPaginated(req, res){
    try{
        const { limit = 10, page = 1, sort = "", query = "" } = req.query;

        let products = await productService.getProductsPaginated(limit, page, sort, query);

        return res.status(200).json(products);
    }
    catch(error){
        return res.status(500).json({
            error:"Error al obtener los productos"
        })
    }
}

async function getProductById(req, res){
    try{
        const pid = req.params.pid;

        let product = await productService.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        return res.status(200).json(product);
    }
    catch(error){
        return res.status(500).json({
            error:"Error al obtener el producto"
        })
    }
}

async function createProduct(req, res){
    try{
        const newProduct = req.body;

        if(!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.status || !newProduct.stock || !newProduct.category) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        let createdProduct = await productService.createProduct(newProduct);
        return res.status(201).json(createdProduct);
    }
    catch(error){
        return res.status(500).json({
            error:"Error al crear el producto"
        })
    }
}

async function updateProduct(req, res){
    try{
        const pid = req.params.pid;
        const updatedProduct = req.body;

        if(!updatedProduct.title || !updatedProduct.description || !updatedProduct.code || !updatedProduct.price || !updatedProduct.status || !updatedProduct.stock || !updatedProduct.category) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        let product = await productService.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        let updated = await productService.updateProduct(pid, updatedProduct);

        return res.status(200).json(updated);
    }
    catch(error){
        return res.status(500).json({
            error:"Error al actualizar el producto"
        })
    }
}

async function deleteProduct(req, res){
    try{
        const pid = req.params.pid;

        let product = await productService.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await productService.deleteProduct(pid);

        return res.status(200).json(product);
    }
    catch(error){
        return res.status(500).json({
            error:"Error al eliminar el producto"
        })
    }
}

export default {
    getProductsPaginated,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};