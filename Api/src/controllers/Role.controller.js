const RoleModel = require('../models/Role.model');

module.exports = {
    CreateNewRole: async (req, res) => {
        const { name, description } = req.body;

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

            return res.status(201).json({
                error: false, 
                Role: NewRole,
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