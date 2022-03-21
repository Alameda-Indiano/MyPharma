const UserModel = require('../models/User');
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
    }
    
};