const mongoose = require('../DataBase/mongoDB');

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    creatdAt: {
        type: String,
        default: Date.now
    }
});

const BrandModel = mongoose.model('Brand', BrandSchema);
module.exports = BrandModel;