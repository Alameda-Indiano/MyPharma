const AdminModel = require('../models/Admin.model');
const UserModel = require('../models/User.model');
const RoleModel = require('../models/Role.model');

const { 
    EncryptedPasswordGenerator, 
    JWTGenerator

} = require('../util/Generator');

const { EncryptedPasswordChecker } = require('../util/Verify');

module.exports = {
    CreateNewAdmin: async (req, res) => {
        const { name, email, password, role } = req.body;

        try {
            if (!name) {
                return res.status(400).json({
                    error: true,
                    message: 'É necessário informa o nome do Admin antes de prosseguir'
                });
            };

            if (!email) {
                return res.status(400).json({
                    error: true,
                    message: 'É necessário informa o email do admin antes de prosseguir'
                });
            };

            if (!password) {
                return res.status(400).json({
                    error: true,
                    message: 'É necessário informa a uma senha inicial para este admin antes de prosseguir'
                });
            };

            if (await AdminModel.findOne({ email })) {
                return res.status(400).json({
                    error: true,
                    message: 'Já existe um admin com este endereço de Email'
                });
            };

            if (await UserModel.findOne({ email })) {
                return res.status(400).json({
                    error: true,
                    message: 'Existe um usuário cadastrado com este endereço de Email'
                });
            };

            const EncryptedPassword = EncryptedPasswordGenerator(password);

            if (!EncryptedPassword) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível criptografar a senha! Tente novamente mais tarde'
                });
            };

            const RoleAdmin = await RoleModel.findOne({ name: role ? role : 'Admin' });

            if (!RoleAdmin) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível cadastrar uma função para este Admin! Tente novamente mais tarde'
                })
            };

            const NewAdmin = await AdminModel.create({ 
                name, 
                email, 
                password: EncryptedPassword, 
                role: RoleAdmin._id
            });
            
            if (!NewAdmin) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível cadastrar um novo Admin! Tente novamente mais tarde'
                });
            };

            RoleAdmin.users.push(NewAdmin._id);
            RoleAdmin.save();
            
            NewAdmin.password = undefined;

            return res.status(201).json({
                error: false,
                admin: NewAdmin
            });

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            });

        };
    },

    ConnectAdmin: async (req, res) => {
        const { email, password } = req.body;

        try {
            if (!email) {
                return res.status(400).json({
                    error: true,
                    message: 'É necessário informa o seu Email antes de prosseguir'
                });
            };

            if (!password) {
                return res.status(400).json({
                    error: true,
                    message: 'É necessário informa a sua senha antes de prosseguir'
                });
            };

            const AdminData = await AdminModel.findOne({ email }).select('+password');

            if (!AdminData) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível encontrar o Admin! Tente novamente mais tarde'
                });
            };

            const PasswordIsTrue = EncryptedPasswordChecker({ 
                Password: password, 
                PasswordToVerify:  AdminData.password 
            });

            if (!PasswordIsTrue) {
                return res.status(407).json({
                    error: true, 
                    message: 'Senha inválida'
                });
            };

            const FilterRole = await RoleModel.findById(AdminData.role);

            if ( !FilterRole ) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível encontrar a função deste Admin! Tente novamente mais tarde'
                });
            };

            const JWT = JWTGenerator({ 
                id: AdminData._id,
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

    ListAdmin: async (req, res) => {
        
        try {
            
            const Admin = await AdminModel.find();

            if (!Admin) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível filtrar a lista de Admins! Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false,
                Admin
            });

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            });
        };

    },

    ListOneAdmin: async (req, res) => {
        
        try {
            
            const Admin = await AdminModel.findById(req.params.id);

            if (!Admin) {
                return res.status(401).json({
                    error: true, 
                    message: 'O admin que você está tentando encontrar não existe'
                });
            };
    
            return res.status(200).json({
                error: false,
                Admin
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

            const AdminWithNewPassword = await AdminModel.findOneAndUpdate(
                { email }, { 
                    password: EncryptedPassword, 
                    CodeExpiresIn: undefined, 
                    Code: '' 

                }, { new: true }).select('-CodeExpiresIn -Code');

            if (!AdminWithNewPassword) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível redefinir a senha! Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false, 
                Admin: AdminWithNewPassword
            });

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
            
        };

    },

    DeleteAdmin: async (req, res) => {
        
        try {
            
            const Admin = await AdminModel.findByIdAndDelete(req.params.id);

            if (!Admin) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível deletar está conta! Tente novamente mais tarde'
                });
            };

            const RoleFilter = await RoleModel.findById(Admin.role);

            if (!RoleFilter) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível localizar a função deste Admin! Tente novamente mais tarde'
                });
            };

            const AdminPositionRole = await RoleFilter.users.indexOf(Admin._id);
            RoleFilter.users.splice(AdminPositionRole, 1);
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