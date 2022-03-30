const mongoose = require('../DataBase/mongoDB');

const UserSchema = new mongoose.Schema({
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
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    creatdAt: {
        type: String,
        default: Date.now
    }
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
