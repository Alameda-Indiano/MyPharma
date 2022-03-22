const mongoose = require('../DataBase/mongoDB');

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    Code: {
        type: String,
        select: false
    },
    CodeExpiresIn: {
        type: Date,
        select: false
    },
    creatdAt: {
        type: String,
        default: Date.now
    }
});

const AdminModel = mongoose.model('Admin', AdminSchema);
module.exports = AdminModel;
