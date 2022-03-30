const routes = require('express').Router();
const { CodeChecker, VerifyToken, RefreshToken, VerifyPermissions } = require('../middlewares/Verify');

const { 
    CreateNewUser, 
    ConnectUser,
    ListOneUser,
    ListUsers,
    SendEmailToResetPassword,
    RedefinePassword

} = require('../controllers/User.controller');

routes.post('/User/Create', CreateNewUser);
routes.post('/User/Login', ConnectUser);
routes.get('/User/:id', VerifyPermissions( [ 'Admin' ] ), ListOneUser);
routes.get('/User', VerifyPermissions( [ 'Admin' ] ), ListUsers);
routes.post('/User/SendEmail', SendEmailToResetPassword);
routes.put('/User/RedefinePassword', CodeChecker, RedefinePassword);


routes.put('/User/AtualizePermission', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ) );
routes.put('/User/Delete', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ) );

module.exports = routes;