const PermissionModel = require('../models/Permission');

module.exports = {
    CreateNewPermission: async (req, res) => {
        const { name, description } = req.body;

        try {
            
            const ExistPermission = await PermissionModel.findOne({ name });

            if(ExistPermission){
                return res.status(400).json({
                    error: true,
                    message: 'Já existe uma permissão deste tipo cadastrada'
                });
            };

            const NewPermission = await PermissionModel.create({ name, description });

            if(!NewPermission){
                return res.status(501).json({
                    error: true, 
                    message: 'Não foi possível cadastrar uma nova permissão! Tente novamente mais tarde'
                });
            };

            return res.status(201).json({
                error: false, 
                permission: NewPermission,
                token:  req.RefreshToken.JWT
            });

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

    ListPermission: async (req, res) => {
        
        try {
            
        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

    ListOnePermission: async (req, res) => {

        try {
            
        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

    UpdatePermission: async (req, res) => {

        try {
            
        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

    DeletePermission: async (req, res) => {

        try {
            
        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

};