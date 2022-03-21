const routes = require('express').Router();
const { VerifyToken, RefreshToken } = require('../middlewares/Verify');

const {
    CreateNewCategory,
    ListOneCategory,
    ListCategory,
    UpdateCategory
    
} = require('../controllers/Category')

routes.post('/Category/Create', VerifyToken, RefreshToken, CreateNewCategory);
routes.get('/Category/:id', VerifyToken, RefreshToken, ListOneCategory);
routes.get('/Category', VerifyToken, RefreshToken, ListCategory);
routes.put('/Category/Atualize/:id', VerifyToken, RefreshToken, UpdateCategory);

module.exports = routes;
