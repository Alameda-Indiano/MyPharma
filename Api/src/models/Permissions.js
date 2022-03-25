const mongoose = require('../DataBase/mongoDB');

const PermissionsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
        required: true
    },
    creatdAt: {
        type: String,
        default: Date.now
    }
});

const PermissionsModel = mongoose.model('Permissions', PermissionsSchema);
module.exports = PermissionsModel;
