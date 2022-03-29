const mongoose = require('../DataBase/mongoDB');

const PermissionSchema = new mongoose.Schema({
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
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    }],
});

const PermissionModel = mongoose.model('Permission', PermissionSchema);
module.exports = PermissionModel;
