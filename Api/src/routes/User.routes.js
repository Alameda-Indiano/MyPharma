const routes = require('express').Router();
const { CodeChecker, VerifyToken, RefreshToken, VerifyPermissions } = require('../middlewares/Verify');

const { 
    CreateNewUser, 
    ConnectUser,
    ListOneUser,
    ListUsers,
    SendEmailToResetPassword,
    RedefinePassword,
    AtualizeRoleUser,
    DeleteUser

} = require('../controllers/User.controller');

routes.post('/User/Create', CreateNewUser);
routes.post('/User/Login', ConnectUser);
routes.get('/User/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'List_User' ] ), ListOneUser);
routes.get('/User', VerifyToken, RefreshToken, VerifyPermissions( [ 'List_User' ] ), ListUsers);
routes.post('/User/SendEmail', SendEmailToResetPassword);
routes.put('/User/RedefinePassword', CodeChecker, RedefinePassword);


routes.put('/User/AtualizeRole/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), AtualizeRoleUser);
routes.delete('/User/Delete/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), DeleteUser);

module.exports = routes;