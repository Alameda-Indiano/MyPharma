const routes = require('express').Router();
const { VerifyToken, RefreshToken, VerifyPermissions } = require('../middlewares/Verify');

const {
    CreateNewBrand,
    ListOneBrand,
    ListBrand,
    UpdateBrand,
    DeleteBrand

} = require('../controllers/Brand.controller')

routes.post('/Brand/Create', VerifyToken, RefreshToken, VerifyPermissions( [ 'Create_Brand' ] ), CreateNewBrand);
routes.get('/Brand/:id', VerifyToken, RefreshToken, ListOneBrand);
routes.get('/Brand', VerifyToken, RefreshToken, ListBrand);
routes.put('/Brand/Atualize/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Atualize_Brand' ] ), UpdateBrand);
routes.delete('/Brand/Delete/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Delete_Brand' ] ), DeleteBrand);

module.exports = routes;
