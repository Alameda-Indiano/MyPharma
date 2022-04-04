const routes = require('express').Router();
const { VerifyToken, RefreshToken, VerifyPermissions } = require('../middlewares/Verify');

const {
    ListOnePermission,
    ListPermission
    
} = require('../controllers/Permission.controller')

routes.get('/Permission/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'List_Permission' ] ), ListOnePermission);
routes.get('/Permission', VerifyToken, RefreshToken,  VerifyPermissions( [ 'List_Permission' ] ), ListPermission);

module.exports = routes;
