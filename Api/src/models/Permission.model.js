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
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    }],
    creatdAt: {
        type: String,
        default: Date.now
    },

});

const PermissionModel = mongoose.model('Permission', PermissionSchema);
module.exports = PermissionModel;
