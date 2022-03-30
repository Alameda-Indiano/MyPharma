const RoleModel = require('../models/Role.model');
const PermissionModel = require('../models/Permission.model');

module.exports = {
    CreateNewRole: async (req, res) => {
        const { name, description, permission } = req.body;

        try {
            
            const ExistRole = await RoleModel.findOne({ name });

            if(ExistRole){
                return res.status(400).json({
                    error: true,
                    message: 'Já existe uma função deste tipo cadastrada'
                });
            };

            const NewRole = await RoleModel.create({ name, description });

            if(!NewRole){
                return res.status(501).json({
                    error: true, 
                    message: 'Não foi possível cadastrar uma nova função! Tente novamente mais tarde'
                });
            };

            await Promise.all(permission.map( async (permi) => {
                const PermissionFilter = await PermissionModel.findById(permi);
                
                PermissionFilter.roles.push(NewRole._id);
                PermissionFilter.save();
                
                await NewRole.permissions.push(permi);    
            }));
            
            await NewRole.save();
            
            return res.status(201).json({
                error: false, 
                role: NewRole,
                token:  req.RefreshToken.JWT
            });

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

    ListRole: async (req, res) => {
        
        try {
            
        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

    ListOneRole: async (req, res) => {

        try {
            
        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

    UpdateRole: async (req, res) => {

        try {
            
        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

    DeleteRole: async (req, res) => {

        try {
            
        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

};