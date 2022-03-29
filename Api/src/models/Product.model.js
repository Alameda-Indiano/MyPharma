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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Brand'
    },
    creatdAt: {
        type: String,
        default: Date.now
    }
});

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;