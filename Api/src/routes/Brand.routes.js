const routes = require('express').Router();
const { VerifyToken, RefreshToken } = require('../middlewares/Verify');

const {
    CreateNewBrand,
    ListOneBrand,
    ListBrand,
    UpdateBrand,
    DeleteBrand

} = require('../controllers/Brand')

routes.post('/Brand/Create', VerifyToken, RefreshToken, CreateNewBrand);
routes.get('/Brand/:id', VerifyToken, RefreshToken, ListOneBrand);
routes.get('/Brand', VerifyToken, RefreshToken, ListBrand);
routes.put('/Brand/Atualize/:id', VerifyToken, RefreshToken, UpdateBrand);
routes.delete('/Brand/Delete/:id', VerifyToken, RefreshToken, DeleteBrand);

module.exports = routes;
