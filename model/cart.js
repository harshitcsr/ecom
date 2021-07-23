const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ItemSchema = new Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        price: {
            type: Number,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        orderbyCustomer: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("order", ItemSchema);
