const UserModel = require('../models/User.model');
const RoleModel = require('../models/Role.model');
const PermissionModel = require('../models/Permission.model');
const { JWTGenerator } = require('../util/Generator');
const { TokenChecker } = require('../util/Verify');

module.exports = {
    CodeChecker: async (req, res, next) => {
        const { email, code } = req.body;

        try {
            const User = await UserModel.findOne({ email }).select('+Code +CodeExpiresIn');

            if (!User) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível localizar nenhum usuário com este endereço de email! Tente novamente mais tarde'
                });
            };

            if (User.Code !== code) {
                return res.status(403).json({
                    error: true, 
                    message: 'Código inválido!'
                });
            };

            if (new Date() > User.CodeExpiresIn) {
                return res.status(403).json({
                    error: true, 
                    message: 'O seu código expirou!'
                });
            };

            next();

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });

        };

    },

    VerifyToken: async (req, res, next) => {
        const token = req.headers['authorization'];

        try {
            if (!token) {
                return res.status(401).json({
                    error: true, 
                    message: 'Um token de autenticação deve ser informado no cabeçalho desta requisição'
                });
            };

            TokenChecker(token, res, req, next);

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });  
        };

    },

    RefreshToken: async (req, res, next) => {
        const { id, email } = req.DataUser;

        try {

            if (!id || !email) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível verificar o usuário! Tente novamente mais tarde'
                });
            };

            const JWT = JWTGenerator({ 
                id,
                email
            });

            if (!JWT) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível gerar o token'
                });
            };

            req.RefreshToken = { JWT };

            next();

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });  
        };
    },

    VerifyPermissions: ( PermissionRequired ) => {
        const RoleAuthorized = async (req, res, next) => {
            const { role } = req.DataUser;

            try {
    
                if (!role) {
                    return res.status(500).json({
                        error: true, 
                        message: 'O usuário não possui nenhuma função! Tente novamente mais tarde'
                    });
                };

                const { permissions } = await RoleModel.findOne({ name: role });
                
                if (!permissions) {
                    return res.status(500).json({
                        error: true, 
                        message: 'Não foi possível localizar as permissões deste usuário! Tente novamente mais tarde'
                    });
                };

                const PermissionsUser = await Promise.all(permissions.map( async (PermissionId) => {
                    const { name } = await PermissionModel.findById(PermissionId);
                    return name;
                }));

                const UserHasPermission = PermissionsUser.some((name) => name.includes(PermissionRequired));
    
                if ( UserHasPermission ) {
                    next();
                
                } else {
                    return res.status(400).json({
                        error: true,
                        message: 'Seu nível de acesso é muito baixo ou não existe'
                    });
    
                };
    
            } catch (error) {
                return res.status(500).json({
                    error: true,
                    message: error.message
                });
            };
        };

        return RoleAuthorized;
    }
    
};