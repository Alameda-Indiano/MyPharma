const UserModel = require('../models/User.model');
const AdminModel = require('../models/Admin.model');
const RoleModel = require('../models/Role.model');
const PermissionModel = require('../models/Permission.model');

const SendEmail = require('../Services/Emails/SendEmail');
const { TwoStepConfirmation } = require('../Services/Emails/Templates/TwoStepConfirmation');

const {
    JWTGenerator,
    RandomCodeGenerator
    
} = require('../util/Generator');

const { TokenChecker } = require('../util/Verify');

module.exports = {
    CodeChecker: ( Model ) => {

        const Checker = async (req, res, next) => {
            const { code, email } = req.body;
    
            try {

                const User = Model === 'User' ?
                    await UserModel.findOne({ email }).select('+Code +CodeExpiresIn') :
                    await AdminModel.findOne({ email }).select('+Code +CodeExpiresIn');
    
                if (!User) {
                    return res.status(500).json({
                        error: true,
                        message: 'Não foi possível localizar nenhum usuário com este endereço de email! Tente novamente mais tarde'
                    });
                };
    
                if (new Date() > User.CodeExpiresIn) {
                    return res.status(403).json({
                        error: true, 
                        message: 'O seu código expirou!'
                    });
                };

                if (User.Code !== code) {
                    return res.status(403).json({
                        error: true, 
                        message: 'Código inválido!'
                    });
                };
    
                next();
    
            } catch (error) {
                return res.status(500).json({
                    error: true, 
                    message: error.message
                });
    
            };
    
        };

        return Checker;

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
    },

    TwoStepVerification: ( Model ) => {

        const Verification = async ( req, res, next ) => {
            const { code, email } = req.body;

            try {

                if (code) {
                   
                    next();

                } else {

                    const User = Model === 'User' ? 
                        await UserModel.findOne({ email }).select('+Code +CodeExpiresIn') :
                        await AdminModel.findOne({ email }).select('+Code +CodeExpiresIn');

                    if (!User) {
                        return res.status(401).json({
                            error: true, 
                            message: 'É necessário informar o seu email antes de prosseguir! Tente novamente mais tarde'
                        });
                    };
        
                    const { code, CodeExpiresIn } = RandomCodeGenerator();
        
                    if (!code || !CodeExpiresIn) {
                        return res.status(500).json({
                            error: true, 
                            message: 'Não foi possível gerar um código! Tente novamente mais tarde'
                        });
                    };
        
                    const NewParameters = Model === 'User' ? 
                        await UserModel.findByIdAndUpdate( User._id , { 
                            Code: code, 
                            CodeExpiresIn: CodeExpiresIn 
                            
                        }, { new: true }).select('+Code +CodeExpiresIn') 
                        :
                        await AdminModel.findByIdAndUpdate( User._id , { 
                            Code: code, 
                            CodeExpiresIn: CodeExpiresIn 
                            
                        }, { new: true }).select('+Code +CodeExpiresIn') 
        
        
                    if (!NewParameters.CodeExpiresIn || !NewParameters.Code) {
                        return res.status(500).json({
                            error: true, 
                            message: 'Não foi possível cadastrar o código de verificação! Tente novamente mais tarde'
                        });
                    };
        
                    const EmailUser = email.toLowerCase();
        
                    const BodyEmail = TwoStepConfirmation({ 
                        code,
                        Email: EmailUser
                    });
        
                    if (!BodyEmail) {
                        return res.status(500).json({
                            error: true,
                            message: 'O servidor não conseguiu gerar um Email! Tente novamente mais tarde'
                        });
                    };
        
                    const { error, message } = await SendEmail.send({ 
                        to: EmailUser, 
                        subject: 'Confirmação em duas etapas MyPharma', 
                        body: BodyEmail
        
                    }).then(() => {
                        return {
                            error: false,
                            message: `Um código de confirmação foi enviado para ${EmailUser}`
                        };
        
                    }).catch((error) => {
                        return {
                            error: true,
                            message: error.message
                        };
        
                    });
        
                    if (error) {
                        return res.status(500).json({
                            error, 
                            message
                        });
                    };
        
                    return res.status(200).json({
                        error, 
                        message
                    });

                };
    
            } catch (error) {
                return res.status(500).json({
                    error: true,
                    message: error.message
                });
            };
    
        };

        return Verification;

    }
    
};