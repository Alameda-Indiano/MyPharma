const UserModel = require('../models/User.model');
const RoleModel = require('../models/Role.model');
const SendEmail = require('../Services/Emails/SendEmail');
const { EmailResetPassword } = require('../Services/Emails/Templates/ResetPassword');

const { 
    EncryptedPasswordGenerator, 
    JWTGenerator,
    RandomCodeGenerator

} = require('../util/Generator');

const { EncryptedPasswordChecker } = require('../util/Verify');

module.exports = {
    CreateNewUser: async (req, res) => {
        const { name, email, password } = req.body;

        try {
            if (!name) {
                return res.status(400).json({
                    error: true,
                    message: 'É necessário informa o nome de usuário antes de prosseguir'
                });
            };

            if (!email) {
                return res.status(400).json({
                    error: true,
                    message: 'É necessário informa o email de usuário antes de prosseguir'
                });
            };

            if (!password) {
                return res.status(400).json({
                    error: true,
                    message: 'É necessário informa a senha de usuário antes de prosseguir'
                });
            };

            if (await UserModel.findOne({ email })) {
                return res.status(400).json({
                    error: true,
                    message: 'Este email já foi cadastrado, faça login ou tente novamente com outro endereço de email'
                });
            };

            const EncryptedPassword = EncryptedPasswordGenerator(password);

            if (!EncryptedPassword) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível criptografar a senha! Tente novamente mais tarde'
                });
            };

            const RoleUser = await RoleModel.findOne({ name: 'User' });

            if (!RoleUser) {
                return res.status(400).json({
                    error: true,
                    message: 'Não foi possível atribuir uma função para o novo usuário! Tente novamente mais tarde'
                })
            };

            const NewUser = await UserModel.create({ name, email, password: EncryptedPassword, role: RoleUser._id });
            
            if (!NewUser) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível cadastrar o usuário! Tente novamente mais tarde'
                });
            };

            RoleUser.users.push(NewUser._id);
            RoleUser.save();
            
            NewUser.password = undefined;

            return res.status(201).json({
                error: false,
                user: NewUser
            });

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            });

        };
    },

    ConnectUser: async (req, res) => {
        const { email, password } = req.body;

        try {
            if (!email) {
                return res.status(400).json({
                    error: true,
                    message: 'É necessário informa o email de usuário antes de prosseguir'
                });
            };

            if (!password) {
                return res.status(400).json({
                    error: true,
                    message: 'É necessário informa a senha de usuário antes de prosseguir'
                });
            };

            const UserData = await UserModel.findOne({ email }).select('+password');

            if (!UserData) {
                return res.status(401).json({
                    error: true, 
                    message: 'Não foi encontrado nenhum usuário com este endereço de email'
                });
            };

            const PasswordIsTrue = EncryptedPasswordChecker({ 
                Password: password, 
                PasswordToVerify:  UserData.password 
            });

            if (!PasswordIsTrue) {
                return res.status(407).json({
                    error: true, 
                    message: 'Senha inválida'
                });
            };

            const FilterRole = await RoleModel.findById(UserData.role);

            if ( !FilterRole ) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível encontrar a função do usuário! Tente novamente mais tarde'
                });
            };

            const JWT = JWTGenerator({ 
                id: UserData._id,
                email,
                role: FilterRole.name
            });

            if (!JWT) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível gerar o token'
                });
            };

            return res.status(200).json({
                error: false,
                token: JWT
            });
            
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            });

        }
    },

    ListUser: async (req, res) => {
        
        try {
            
            const Users = await UserModel.find();

            if (!Users) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível filtrar a lista de usuário! Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false,
                Users
            });

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            });
        };

    },

    ListOneUser: async (req, res) => {
        
        try {
            
            const User = await UserModel.findById(req.params.id);

            if (!User) {
                return res.status(401).json({
                    error: true, 
                    message: 'O usuário que você está tentando encontrar não existe'
                });
            };
    
            return res.status(200).json({
                error: false,
                User
            });
            
        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    },
    
    SendEmailToResetPassword: async (req, res) => {
        const { email } = req.body;

        try {
            if (!email) {
                return res.status(401).json({
                    error: true,
                    message: 'É necessário informar o seu email antes de prosseguir'
                });
            };

            const User = await UserModel.findOne({ email });
            
            if (!User) {
                return res.status(401).json({
                    error: true,
                    message: 'Usuário não está cadastrado'
                });
            };

            const { code, CodeExpiresIn } = RandomCodeGenerator();

            if (!code || !CodeExpiresIn) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível gerar um código! Tente novamente mais tarde'
                });
            };

            const NewParameters = await UserModel.findByIdAndUpdate( User._id , { 
                Code: code, 
                CodeExpiresIn: CodeExpiresIn 
                
            }, { new: true }).select('+Code +CodeExpiresIn');

            if (!NewParameters.CodeExpiresIn || !NewParameters.Code) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível cadastrar o código de verificação! Tente novamente mais tarde'
                });
            };

            const EmailUser = email.toLowerCase();

            const BodyEmail = EmailResetPassword({ 
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
                subject: 'Redefinir Senha do MyPharma', 
                body: BodyEmail

            }).then(() => {
                return {
                    error: false,
                    message: `Um email foi enviado para ${EmailUser}`
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

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });

        };

    },

    RedefinePassword: async (req, res) => {
        const { email, password } = req.body;

        try {
            const EncryptedPassword = EncryptedPasswordGenerator(password);

            if (!EncryptedPassword) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível criptografar a senha! Tente novamente mais tarde'
                });
            };

            const UserWithNewPassword = await UserModel.findOneAndUpdate(
                { email }, { 
                    password: EncryptedPassword, 
                    CodeExpiresIn: undefined, 
                    Code: '' 

                }, { new: true }).select('-CodeExpiresIn -Code');

            if (!UserWithNewPassword) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível redefinir senha! Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false, 
                user: UserWithNewPassword
            });

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
            
        };

    },

    DeleteUser: async (req, res) => {
        
        try {
            
            const User = await UserModel.findByIdAndDelete(req.params.id);

            if (!User) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível deletar está conta! Tente novamente mais tarde'
                });
            };

            const RoleFilter = await RoleModel.findById(User.role);

            if (!RoleFilter) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível localizar a função deste usuário! Tente novamente mais tarde'
                });
            };

            const UserPositionRole = await RoleFilter.users.indexOf(User._id);
            RoleFilter.users.splice(UserPositionRole, 1);
            await RoleFilter.save();

            return res.status(200).json({
                error: false,
                message: 'Conta deletada com sucesso'
            });

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            });
        };

    }

};