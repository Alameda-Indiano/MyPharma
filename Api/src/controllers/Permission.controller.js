const PermissionModel = require('../models/Permission.model');
const RoleModel = require('../models/Role.model');

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

    },

    UpdatePermission: async (req, res) => {
        const { name, description } = req.body;

        try {
            
            const ExistPermission = await PermissionModel.findOne({ name });

            if(ExistPermission){
                return res.status(400).json({
                    error: true,
                    message: 'Já existe uma permissão deste tipo cadastrada'
                });
            };

            const NewPermission = await PermissionModel.findByIdAndUpdate(req.params.id, { name, description }, { new: true });

            if(!NewPermission){
                return res.status(501).json({
                    error: true, 
                    message: 'Não foi possível atualizar a permissão! Tente novamente mais tarde'
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

    DeletePermission: async (req, res) => {

        try {
            
            const Permisson = await PermissionModel.findById(req.params.id);

            if (!Permisson) {
                return res.status(401).json({
                    error: true,
                    message: 'A permissão que você informou não existe'
                });
            };

            await Promise.all(Permisson.roles.map( async (role) => {
                const RoleFilter = await RoleModel.findById(role);

                const PermissionPositionRole = await RoleFilter.permissions.indexOf(req.params.id);
                await RoleFilter.splice(PermissionPositionRole, 1);
                await RoleFilter.save();

            }));    

            const DeletePermisson = await PermissionModel.findByIdAndDelete(req.params.id);

            if (!DeletePermisson) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível deletar a permissão informada! Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false,
                message: 'Permissão deletada'
            });

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

};