import { ProductModel } from "../models/product.model.js"

export class ProductsDAO{
    constructor(){}

    async get(){
        return await ProductModel.find().lean()
    }

    async getBy(filtro={}){
        console.log("Filtro de búsqueda:", filtro);
        return await ProductModel.find(filtro).lean()
    }

    async getById(id){
        return await ProductModel.findById(id).lean()
    }

    async getPaginate(limit, page, sort, query){
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
    }

    async create(producto){
        return await ProductModel.create(producto)
    }

    async update(id, producto){
        return await ProductModel.findByIdAndUpdate(id, producto, {new: true}).lean()
    }

    async delete(id){
        return await ProductModel.findByIdAndDelete(id).lean()
    }
}