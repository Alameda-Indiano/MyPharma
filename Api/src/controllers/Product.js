const ProductModel = require('../models/Product');

module.exports = {
    CreateNewProduct: async (req, res) => {
        const { name, description, price } = req.body;

        try {
            if (!name) {
                return res.status(401).json({
                    error: true,
                    message: 'É necessário informar o nome do produto antes de prosseguir'
                });
            };

            if (await ProductModel.findOne({ name })) {
                return res.status(400).json({
                    error: true, 
                    message: 'Um produto com este nome já foi cadastrado no banco de dados'
                });
            };

            if (!description) {
                return res.status(401).json({
                    error: true,
                    message: 'É necessário informar uma descrição para o produto antes de prosseguir'
                });
            };

            if (!price) {
                return res.status(401).json({
                    error: true,
                    message: 'É necessário informar o preço do produto antes de prosseguir'
                });
            };

            const NewProduct = await ProductModel.create({ name, description, price });

            if (!NewProduct) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível cadastrar um novo produto! Tente novamente mais tarde'
                });
            };

            return res.status(201).json({
                error: false, 
                product: NewProduct,
                token:  req.RefreshToken.JWT
            });
            
        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });

        };

    },

    ListProduct: async (req, res) => {
        
        try {
            const Product = await ProductModel.find();
    
            if (!Product) {
                return res.status(500).json({
                    error: true, 
                    message: 'Nenhum produto cadastrado! Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false, 
                product: Product,
                token:  req.RefreshToken.JWT
            });

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });

        };
    
    },

    ListOneProduct: async (req, res) => {
        const { id } = req.params;

        try {
            const Product = await ProductModel.findById(id);
    
            if (!Product) {
                return res.status(500).json({
                    error: true, 
                    message: 'Nenhum produto cadastrado! Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false, 
                product: Product,
                token:  req.RefreshToken.JWT
            });

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });

        };

    },

    UpdateProduct: async (req, res) => {
        const { name, description, price } = req.body;

        try {
            if (!name) {
                return res.status(401).json({
                    error: true,
                    message: 'É necessário informar o nome do produto antes de prosseguir'
                });
            };

            if (await ProductModel.findOne({ name })) {
                return res.status(400).json({
                    error: true, 
                    message: 'Um produto com este nome já foi cadastrado no banco de dados'
                });
            };

            if (!description) {
                return res.status(401).json({
                    error: true,
                    message: 'É necessário informar uma descrição para o produto antes de prosseguir'
                });
            };

            if (!price) {
                return res.status(401).json({
                    error: true,
                    message: 'É necessário informar o preço do produto antes de prosseguir'
                });
            };

            const NewProduct = await ProductModel.findByIdAndUpdate(req.params.id, { name, description, price }, { new: true });

            if (!NewProduct) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível cadastrar um novo produto! Tente novamente mais tarde'
                });
            };

            return res.status(201).json({
                error: false, 
                product: NewProduct,
                token:  req.RefreshToken.JWT
            });

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });

        };

    },

    RemoveProduct: async (req, res) => {
        const { id } = req.params;

        try {

            if (!id) {
                return res.status(401).json({
                    error: true, 
                    message: 'É necessário informar o id do produto que você deseja deletar'
                });
            };

            const Error = await ProductModel.findByIdAndRemove(id, { new: true });

            if (!Error) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível deletar o produto! Tente novamente mais tarde'
                });
            };

            return res.status(201).json({
                error: false, 
                product: NewProduct,
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