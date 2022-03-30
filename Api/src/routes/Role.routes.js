const routes = require('express').Router();
const { VerifyToken, RefreshToken, VerifyPermissions } = require('../middlewares/Verify');

const {
    CreateNewRole,
    ListOneRole,
    ListRole,
    UpdateRole,
    DeleteRole
    
} = require('../controllers/Role.controller')

routes.post('/Role/Create', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), CreateNewRole);
routes.get('/Role/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), ListOneRole);
routes.get('/Role', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), ListRole);
routes.put('/Role/Atualize/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), UpdateRole);
routes.delete('/Role/Remove/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), DeleteRole);

module.exports = routes;
