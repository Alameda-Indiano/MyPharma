const routes = require('express').Router();
const { VerifyToken, RefreshToken } = require('../middlewares/Verify');

const {
    CreateNewProduct,
    ListOneProduct,
    ListProduct,
    UpdateProduct,
    RemoveProduct
    
} = require('../controllers/Product')

routes.post('/Product/Create', VerifyToken, RefreshToken, CreateNewProduct);
routes.get('/Product/:id', VerifyToken, RefreshToken, ListOneProduct);
routes.get('/Product', VerifyToken, RefreshToken, ListProduct);
routes.put('/Product/Atualize', VerifyToken, RefreshToken, UpdateProduct);
routes.delete('/Product/Remove/:id', VerifyToken, RefreshToken, RemoveProduct);

module.exports = routes;
