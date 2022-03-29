const routes = require('express').Router();
const { VerifyToken, RefreshToken } = require('../middlewares/Verify');

const {
    CreateNewRole,
    ListOneRole,
    ListRole,
    UpdateRole,
    DeleteRole
    
} = require('../controllers/Role.controller')

routes.post('/Role/Create', VerifyToken, RefreshToken, CreateNewRole);
routes.get('/Role/:id', VerifyToken, RefreshToken, ListOneRole);
routes.get('/Role', VerifyToken, RefreshToken, ListRole);
routes.put('/Role/Atualize/:id', VerifyToken, RefreshToken, UpdateRole);
routes.delete('/Role/Remove/:id', VerifyToken, RefreshToken, DeleteRole);

module.exports = routes;
