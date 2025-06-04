import { ProductModel } from "./models/product.model.js";

class ProductManager {
    constructor() {
        this.path = "";
    }

    async obtenerProductos() {
        try {
            const products = await ProductModel.find().lean();

            return products;
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            return [];
        }
    }

    async obtenerProductosPaginados(limit, page, sort, query) {
        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
                lean: true
            };
            
            const filter = query
                ? {
                    $or: [
                        { category: { $regex: query, $options: "i" } },
                        { status: query.toLowerCase() === "true" }
                    ]
                }
                : {};

            const result = await ProductModel.paginate(filter, options);
            console.log("Resultado de la paginación:", result);
            return {
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
            };
        } catch (error) {
            console.error("Error al obtener los productos paginados:", error);
            return null;
        }
    }

    async obtenerProductoPorId(id) {
        try {
            const product = await ProductModel.findById(id).lean();
            if (!product) {
                console.error("Producto no encontrado");
                return null;
            }
            return product;
        } catch (error) {
            console.error("Error al obtener el producto por ID:", error);
            return null;
        }   
    }

    async agregarProducto(producto) {
        try {
            const newProduct = await ProductModel.create(producto);

            return newProduct;
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    }

    async actualizarProducto(id, productoActualizado) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, productoActualizado, { new: true, runValidators: true }).lean();

            if (!updatedProduct) {
                console.error("Producto no encontrado");
                return null;
            }
            return updatedProduct;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    }

    async eliminarProducto(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id).lean();
            if (!deletedProduct) {
                console.error("Producto no encontrado");
                return null;
            }
            return deletedProduct;
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    }
}

export default ProductManager;