const routes = require('express').Router();
const { VerifyToken, RefreshToken, VerifyPermissions } = require('../middlewares/Verify');

const {
    CreateNewProduct,
    ListOneProduct,
    ListProduct,
    UpdateProduct,
    RemoveProduct
    
} = require('../controllers/Product.controller')

routes.post('/Product/Create', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), CreateNewProduct);
routes.get('/Product/:id', VerifyToken, RefreshToken, ListOneProduct);
routes.get('/Product', VerifyToken, RefreshToken, ListProduct);
routes.put('/Product/Atualize/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), UpdateProduct);
routes.delete('/Product/Remove/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Admin' ] ), RemoveProduct);

module.exports = routes;
