const routes = require('express').Router();
const { CodeChecker, VerifyToken, RefreshToken, VerifyPermissions } = require('../middlewares/Verify');
const { SendEmailToResetPassword } = require('../middlewares/Generator');

const { 
    CreateNewUser, 
    ConnectUser,
    ListOneUser,
    ListUser,
    RedefinePassword,
    DeleteUser

} = require('../controllers/User.controller');

routes.post('/User/Create', CreateNewUser);
routes.post('/User/Login', ConnectUser);
routes.get('/User/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'List_User' ] ), ListOneUser);
routes.get('/User', VerifyToken, RefreshToken, VerifyPermissions( [ 'List_User' ] ), ListUser);
routes.put('/User/RedefinePassword', SendEmailToResetPassword('User'), CodeChecker('User'), RedefinePassword);

routes.delete('/User/Delete/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Delete_User' ] ), DeleteUser);

module.exports = routes;