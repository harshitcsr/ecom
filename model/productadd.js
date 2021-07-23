const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        required: true
    },
    finalprice: {
        type: Number,
        required: true
    }
})

const product = mongoose.model('product', productSchema);
module.exports = product;