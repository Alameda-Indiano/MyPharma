const routes = require('express').Router();
const { VerifyToken, RefreshToken } = require('../middlewares/Verify');

const {
    CreateNewBrand,
    ListOneBrand,
    ListBrand,
    UpdateBrand

} = require('../controllers/Brand')

routes.post('/Brand/Create', VerifyToken, RefreshToken, CreateNewBrand);
routes.get('/Brand/:id', VerifyToken, RefreshToken, ListOneBrand);
routes.get('/Brand', VerifyToken, RefreshToken, ListBrand);
routes.put('/Category/Atualize/:id', VerifyToken, RefreshToken, UpdateBrand);

module.exports = routes;
