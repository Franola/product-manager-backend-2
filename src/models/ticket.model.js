import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true
    },
    purchaser: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
        required: true 
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            quantity: { type: Number, default: 1, min: 1 },
            price: { type: Number, required: true }
        }
    ],
    purchase_datetime: { type: Date, default: Date.now },
    total: { type: Number, required: true }
});

export const TicketModel = mongoose.model('Tickets', ticketSchema);