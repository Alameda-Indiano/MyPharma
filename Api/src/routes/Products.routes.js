const routes = require('express').Router();
const { VerifyToken, RefreshToken } = require('../middlewares/Verify');

const {
    CreateNewProduct,
    ListOneProduct,
    ListProduct
    
} = require('../controllers/Product')

routes.post('/Product/Create', VerifyToken, RefreshToken, CreateNewProduct);
routes.get('/Product/:id', VerifyToken, RefreshToken, ListOneProduct)
routes.get('/Product', VerifyToken, RefreshToken, ListProduct)

module.exports = routes;
