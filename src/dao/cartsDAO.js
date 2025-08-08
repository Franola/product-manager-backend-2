import { CartModel } from "../models/cart.model.js";

export class CartsDAO{
    constructor(){}

    async get(){
        return await CartModel.find().lean()
    }

    async getBy(filtro={}){
        return await CartModel.findOne(filtro).lean()
    }

    async getById(id){
        return await CartModel.findById(id).lean()
    }

    async getByIdWithProducts(id){
        return await CartModel.findById(id).populate('products.product').lean()
    }

    async create(cart){
        return await CartModel.create(cart)
    }

    async update(id, cart){
        return await CartModel.findByIdAndUpdate(id, cart, {new: true}).lean()
    }

    async delete(id){
        return await CartModel.findByIdAndDelete(id).lean()
    }
}