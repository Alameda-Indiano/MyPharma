const routes = require('express').Router();
const { CodeChecker } = require('../middlewares/Verify');

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
routes.get('/User/:id', ListOneUser);
routes.get('/User', ListUsers);
routes.post('/User/SendEmail', SendEmailToResetPassword);
routes.put('/User/RedefinePassword', CodeChecker, RedefinePassword);

module.exports = routes;