const CategoryModel = require('../models/Category');

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

};