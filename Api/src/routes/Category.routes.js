const routes = require('express').Router();
const { VerifyToken, RefreshToken, VerifyPermissions } = require('../middlewares/Verify');

const {
    CreateNewCategory,
    ListOneCategory,
    ListCategory,
    UpdateCategory,
    DeleteCategory
    
} = require('../controllers/Category.controller')

routes.post('/Category/Create', VerifyToken, RefreshToken, VerifyPermissions( [ 'Create_Category' ] ), CreateNewCategory);
routes.get('/Category/:id', VerifyToken, RefreshToken, ListOneCategory);
routes.get('/Category', VerifyToken, RefreshToken, ListCategory);
routes.put('/Category/Atualize/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Atualize_Category' ] ), UpdateCategory);
routes.delete('/Category/Delete/:id', VerifyToken, RefreshToken, VerifyPermissions( [ 'Delete_Category' ] ), DeleteCategory);

module.exports = routes;
