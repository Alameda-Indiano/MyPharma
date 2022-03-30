const { compareSync } = require('bcrypt');
const { verify } = require('jsonwebtoken');

module.exports = {
    EncryptedPasswordChecker: ({ Password, PasswordToVerify }) => {
        return compareSync(Password, PasswordToVerify);

    },

    TokenChecker: async (token, res, req, next) => {
        verify(token, process.env.SECRET_JWT, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    error: true,
                    message: err.message
                });
            };
            
            req.DataUser = { 
                id: decoded.id, 
                email: decoded.email,
                role: decoded.role
            };

            next();

        });
    },
    
};