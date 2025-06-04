import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            quantity: { type: Number, default: 1, min: 1 }
        }
    ]
});

export const CartModel = mongoose.model('Carts', cartSchema);