const routes = require('express').Router();
const { VerifyToken, RefreshToken, VerifyPermissions, CodeChecker, TwoStepVerification } = require('../middlewares/Verify');
const { SendEmailToResetPassword } = require('../middlewares/Generator');

const { 
    CreateNewAdmin, 
    ConnectAdmin,
    ListOneAdmin,
    ListAdmin,
    RedefinePassword,
    DeleteAdmin

} = require('../controllers/Admin.controller');

routes.post('/Admin/Create', VerifyToken, RefreshToken, VerifyPermissions( [ 'Create_Admin' ] ), CreateNewAdmin);
routes.post('/Admin/Login', TwoStepVerification('Admin'), CodeChecker('Admin'), ConnectAdmin);
routes.get('/Admin/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'List_Admin' ] ), ListOneAdmin);
routes.get('/Admin', VerifyToken, RefreshToken, VerifyPermissions( [ 'List_Admin' ] ), ListAdmin);
routes.put('/Admin/RedefinePassword', SendEmailToResetPassword('Admin'), CodeChecker('Admin'), RedefinePassword);

routes.delete('/Admin/Delete/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Delete_Admin' ] ), DeleteAdmin);

module.exports = routes;