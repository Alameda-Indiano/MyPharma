const mongoose = require('../DataBase/mongoDB');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    creatdAt: {
        type: String,
        default: Date.now
    }
});

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;