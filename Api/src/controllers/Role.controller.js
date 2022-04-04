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

            await Promise.all(permission.map( async (PermissionId) => {
                const PermissionFilter = await PermissionModel.findById(PermissionId);
                
                await PermissionFilter.roles.push(NewRole._id);
                await PermissionFilter.save();
                
                await NewRole.permissions.push(PermissionId);    
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
        
            const roles = await RoleModel.find().populate([ 'permissions', 'users' ]);
            
            if (!roles) {
                return res.status(501).json({
                    error: true, 
                    message: 'Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false, 
                roles
            });
            
        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

    ListOneRole: async (req, res) => {

        try {
        
            const Roles = await RoleModel.findById(req.params.id).populate([ 'permissions', 'users' ]);
            
            if (!Roles) {
                return res.status(501).json({
                    error: true, 
                    message: 'Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false, 
                roles: Roles
            });
            
        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

    UpdateRole: async (req, res) => {
        const { name, description, permission } = req.body;

        try {
            
            const ExistRole = await RoleModel.findOne({ name });

            if(ExistRole && ExistRole._id.toString() !== req.params.id){
                return res.status(400).json({
                    error: true,
                    message: 'Já existe uma função deste tipo cadastrada'
                });
            };

            const OldRole = await RoleModel.findById(req.params.id);

            await Promise.all(OldRole.permissions.map( async (PermissionId) => {
                const Permissions = await PermissionModel.findById(PermissionId);
                
                const RolePositionPermission = Permissions.roles.indexOf(OldRole._id);
                await Permissions.roles.splice(RolePositionPermission, 1);
                
                await Permissions.save();

                OldRole.permissions = [];

            }));

            OldRole.save();

            const NewRole = await RoleModel.findByIdAndUpdate(req.params.id, { name, description }, { new: true });

            if(!NewRole){
                return res.status(501).json({
                    error: true, 
                    message: 'Não foi possível atualizar está função! Tente novamente mais tarde'
                });
            };

            await Promise.all(permission.map( async (PermissionId) => {
                const PermissionFilter = await PermissionModel.findById(PermissionId);
                
                await PermissionFilter.roles.push(NewRole._id);
                await PermissionFilter.save();
                
                await NewRole.permissions.push(PermissionId);    
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

    DeleteRole: async (req, res) => {

        try {

            const Role = await RoleModel.findById(req.params.id);

            if (!Role) {
                return res.status(401).json({
                    error: true,
                    message: 'A role informada não existe! Tente novamente mais tarde'
                });
            };

            await Promise.all(Role.permissions.map( async (PermissionsId) => {
                const Permission = await PermissionModel.findById(PermissionsId);

                const RolePositionPermission = await Permission.roles.indexOf(Role._id);
                await Permission.roles.splice(RolePositionPermission, 1);
                Permission.save();

            }));

            const DelteRole = await RoleModel.findByIdAndDelete(req.params.id);

            if (!DelteRole) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível deletar a função! Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false,
                message: 'A função foi deletada'
            });

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },

};