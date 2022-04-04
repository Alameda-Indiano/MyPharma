const routes = require('express').Router();
const { VerifyToken, RefreshToken, VerifyPermissions } = require('../middlewares/Verify');

const {
    CreateNewRole,
    ListOneRole,
    ListRole,
    UpdateRole,
    DeleteRole
    
} = require('../controllers/Role.controller')

routes.post('/Role/Create', VerifyToken, RefreshToken, VerifyPermissions( [ 'Create_Role' ] ), CreateNewRole);
routes.get('/Role/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'List_Role' ] ), ListOneRole);
routes.get('/Role', VerifyToken, RefreshToken, VerifyPermissions( [ 'List_Role' ] ), ListRole);
routes.put('/Role/Atualize/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Atualize_Role' ] ), UpdateRole);
routes.delete('/Role/Remove/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Delete_Role' ] ), DeleteRole);

module.exports = routes;
