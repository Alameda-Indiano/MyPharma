const PermissionModel = require('../models/Permission.model');
const RoleModel = require('../models/Role.model');

module.exports = {
    ListPermission: async (req, res) => {
        
        try {
        
            const permissions = await PermissionModel.find();
            
            if (!permissions) {
                return res.status(501).json({
                    error: true, 
                    message: 'Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false, 
                permissions
            });
            
        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

    ListOnePermission: async (req, res) => {

        try {
        
            const Permissions = await PermissionModel.findById(req.params.id);
            
            if (!Permissions) {
                return res.status(501).json({
                    error: true, 
                    message: 'Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false, 
                permissions: Permissions
            });
            
        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    }

};