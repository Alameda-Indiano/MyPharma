const mongoose = require('../DataBase/mongoDB');

const RoleSchema = new mongoose.Schema({
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
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
    }],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
});

const RoleModel = mongoose.model('Role', RoleSchema);
module.exports = RoleModel;
