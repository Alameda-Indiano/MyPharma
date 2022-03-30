const routes = require('express').Router();
const { VerifyToken, RefreshToken, VerifyPermissions } = require('../middlewares/Verify');

const {
    CreateNewPermission,
    ListOnePermission,
    ListPermission,
    UpdatePermission,
    DeletePermission
    
} = require('../controllers/Permission.controller')

routes.post('/Permission/Create', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), CreateNewPermission);
routes.get('/Permission/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), ListOnePermission);
routes.get('/Permission', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), ListPermission);
routes.put('/Permission/Atualize/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), UpdatePermission);
routes.delete('/Permission/Remove/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), DeletePermission);

module.exports = routes;
