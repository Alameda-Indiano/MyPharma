const routes = require('express').Router();
const { VerifyToken, RefreshToken } = require('../middlewares/Verify');

const {
    CreateNewCategory,
    ListOneCategory,
    ListCategory
    
} = require('../controllers/Category')

routes.post('/Category/Create', VerifyToken, RefreshToken, CreateNewCategory);
routes.get('/Category/:id', VerifyToken, RefreshToken, ListOneCategory);
routes.get('/Category', VerifyToken, RefreshToken, ListCategory);

module.exports = routes;
