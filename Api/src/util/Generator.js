const { hashSync } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { randomBytes } = require('crypto');

module.exports = {
    EncryptedPasswordGenerator: (password) => {
        return hashSync(password, 10);
        
    },

    JWTGenerator: (params = { id, email, role }) => {
        return sign(params, process.env.SECRET_JWT, {
            expiresIn: 60 * 60 // 1h
        });
        
    },

    RandomCodeGenerator: () => {
        const code = randomBytes(4).toString('hex');

        const CodeExpiresIn = new Date();
        CodeExpiresIn.setMinutes(CodeExpiresIn.getMinutes() + 10);

        return { code, CodeExpiresIn };

    }
    
};