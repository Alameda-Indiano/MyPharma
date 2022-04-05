const AdminModel = require("../models/Admin.model");
const UserModel = require("../models/User.model");

const SendEmail = require('../Services/Emails/SendEmail');
const { EmailResetPassword } = require('../Services/Emails/Templates/ResetPassword');

const { 
    RandomCodeGenerator

} = require('../util/Generator');

module.exports = {
    SendEmailToResetPassword: ( Model ) => {
        
        const ToResetPassword = async (req, res, next) => {
            const { email, code } = req.body;
    
            try {

                if (code) {

                    next();

                } else {

                    if (!email) {
                        return res.status(401).json({
                            error: true,
                            message: 'É necessário informar o seu email antes de prosseguir'
                        });
                    };
        
                    const User = Model === 'User' ? 
                        await UserModel.findOne({ email }):
                        await AdminModel.findOne({ email });
                    
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
        
                    const NewParameters = Model === 'User' ?
                        await UserModel.findByIdAndUpdate( User._id , { 
                            Code: code, 
                            CodeExpiresIn: CodeExpiresIn 
                            
                        }, { new: true }).select('+Code +CodeExpiresIn')
                        :
                        await AdminModel.findByIdAndUpdate( User._id , { 
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
                };
    
            } catch (error) {
                return res.status(500).json({
                    error: true, 
                    message: error.message
                });
    
            };
    
        };

        return ToResetPassword;

    }

};