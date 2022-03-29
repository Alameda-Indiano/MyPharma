const mongoose = require('../DataBase/mongoDB');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    creatdAt: {
        type: String,
        default: Date.now
    }
});

const CategoryModel = mongoose.model('Category', CategorySchema);
module.exports = CategoryModel;