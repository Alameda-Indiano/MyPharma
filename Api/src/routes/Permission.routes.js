const routes = require('express').Router();
const { VerifyToken, RefreshToken } = require('../middlewares/Verify');

const {
    CreateNewPermission,
    ListOnePermission,
    ListPermission,
    UpdatePermission,
    DeletePermission
    
} = require('../controllers/Permission.controller')

routes.post('/Permission/Create', VerifyToken, RefreshToken, CreateNewPermission);
routes.get('/Permission/:id', VerifyToken, RefreshToken, ListOnePermission);
routes.get('/Permission', VerifyToken, RefreshToken, ListPermission);
routes.put('/Permission/Atualize/:id', VerifyToken, RefreshToken, UpdatePermission);
routes.delete('/Permission/Remove/:id', VerifyToken, RefreshToken, DeletePermission);

module.exports = routes;
