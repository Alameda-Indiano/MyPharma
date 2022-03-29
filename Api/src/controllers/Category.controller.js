const CategoryModel = require('../models/Category.model');
const ProductModel = require('../models/Product.model');

module.exports = {
    CreateNewCategory: async (req, res) => {
        const { name, description } = req.body;

        try {
            if (!name) {
                return res.status(401).json({
                    error: true, 
                    message: 'É necessário informar um nome para a nova Categoria'
                });
            };

            if (await CategoryModel.findOne({ name })) {
                return res.status(401).json({
                    error: true,
                    message: 'Não é possível cadastrar duas categorias com o mesmo nome'
                });
            };

            if (!description) {
                return res.status(401).json({
                    error: true, 
                    message: 'É necessário informar uma breve descrição para a nova Categoria'
                });
            };

            const NewCategory = await CategoryModel.create({ name, description });

            if (!NewCategory) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível cadastrar a nova categoria! Tente novamente mais tarde'
                });
            };

            return res.status(201).json({
                error: false,
                category: NewCategory,
                token: req.RefreshToken.JWT
            });

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            });
            
        };

    },

    ListCategory: async (req, res) => {
        
        try {
            const Category = await CategoryModel.find();
    
            if (!Category) {
                return res.status(500).json({
                    error: true, 
                    message: 'Nenhum produto cadastrado! Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false, 
                Category: Category,
                token:  req.RefreshToken.JWT
            });

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });

        };
    
    },

    ListOneCategory: async (req, res) => {

        try {

            const Category = await CategoryModel.findById(req.params.id);
    
            if (!Category) {
                return res.status(500).json({
                    error: true, 
                    message: 'Nenhum produto cadastrado! Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false, 
                Category: Category,
                token:  req.RefreshToken.JWT
            });

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });

        };

    },

    UpdateCategory: async (req, res) => {
        const { name, description } = req.body;

        try {
            if (!name) {
                return res.status(401).json({
                    error: true, 
                    message: 'É necessário informar um nome para a nova Categoria'
                });
            };

            if (await CategoryModel.findOne({ name })) {
                return res.status(401).json({
                    error: true,
                    message: 'Não é possível cadastrar duas categorias com o mesmo nome'
                });
            };

            if (!description) {
                return res.status(401).json({
                    error: true, 
                    message: 'É necessário informar uma breve descrição para a nova Categoria'
                });
            };

            const NewCategory = await CategoryModel.findByIdAndUpdate(req.params.id, { name, description }, { new: true });

            if (!NewCategory) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível cadastrar a nova categoria! Tente novamente mais tarde'
                });
            };

            return res.status(201).json({
                error: false,
                category: NewCategory,
                token: req.RefreshToken.JWT
            });

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            });
            
        };

    },

    DeleteCategory: async (req, res) => {
        const { NewCategory } = req.body;

        try {

            const CategoryFilter = await CategoryModel.findById(req.params.id);

            if (!CategoryFilter) {
                return res.status(500).json({
                    error: true,
                    message: 'A categoria não existe! Tente novamente mais tarde'
                });
            };

            const Products = await ProductModel.find({ category: CategoryFilter._id });

            if (!Products[0]) {
                const CategoryRemove = await CategoryModel.findByIdAndDelete(req.params.id);

                if (!CategoryRemove) {
                    return res.status(500).json({
                        error: true,
                        message: 'Não foi possível remover a categoria! Tente novamente mais tarde'
                    });
                };
    
                return res.status(201).json({
                    error: false,
                    message: 'Categoria removida com sucesso',
                    token:  req.RefreshToken.JWT
                });
                
            };

            if (!NewCategory) {
                return res.status(401).json({
                    error: true,
                    message: 'É necessário informar uma nova categoria para os produtos antes de deletar a atual'
                });
            };

            await Promise.all(Products.map( async (product) => {
                const NewCategoryProduct = await ProductModel.findByIdAndUpdate(product._id, { category: NewCategory }, { new: true });

                if (!NewCategoryProduct) {
                    return res.status(500).json({
                        error: true,
                        message: 'Não foi possível atualizar a categoria dos produtos! Tente novamente mais tarde'
                    });
                };

                const AtualizeCategory = await CategoryModel.findById(NewCategory);

                if (!AtualizeCategory) {
                    return res.status(500).json({
                        error: true, 
                        message: 'Não foi possível localizar a nova categoria! Tente novamente mais tarde'
                    });
                };

                await AtualizeCategory.products.push(NewCategoryProduct);
                await AtualizeCategory.save();

            }));

            const CategoryRemove = await CategoryModel.findByIdAndDelete(req.params.id);

            if (!CategoryRemove) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível remover a categoria! Tente novamente mais tarde'
                });
            };

            return res.status(201).json({
                error: false,
                message: 'Categoria removida com sucesso',
                token:  req.RefreshToken.JWT
            });

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });
        };

    }

};