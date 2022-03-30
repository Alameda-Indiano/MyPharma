const routes = require('express').Router();
const { VerifyToken, RefreshToken, VerifyPermissions } = require('../middlewares/Verify');

const {
    CreateNewBrand,
    ListOneBrand,
    ListBrand,
    UpdateBrand,
    DeleteBrand

} = require('../controllers/Brand.controller')

routes.post('/Brand/Create', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), CreateNewBrand);
routes.get('/Brand/:id', VerifyToken, RefreshToken, ListOneBrand);
routes.get('/Brand', VerifyToken, RefreshToken, ListBrand);
routes.put('/Brand/Atualize/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), UpdateBrand);
routes.delete('/Brand/Delete/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), DeleteBrand);

module.exports = routes;
