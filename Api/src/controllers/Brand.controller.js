const BrandModel = require('../models/Brand.model');
const ProductModel = require('../models/Product.model');

module.exports = {
    CreateNewBrand: async (req, res) => {
        const { name } = req.body;

        try {
            if (!name) {
                return res.status(401).json({
                    error: true, 
                    message: 'É necessário informar um nome para a nova Categoria'
                });
            };

            if (await BrandModel.findOne({ name })) {
                return res.status(401).json({
                    error: true,
                    message: 'Não é possível cadastrar duas marcas com o mesmo nome'
                });
            };

            const NewBrand = await BrandModel.create({ name });

            if (!NewBrand) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível cadastrar a nova categoria! Tente novamente mais tarde'
                });
            };

            return res.status(201).json({
                error: false,
                Brand: NewBrand,
                token: req.RefreshToken.JWT
            });

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            });
            
        };

    },

    ListBrand: async (req, res) => {
        
        try {
            const Brand = await BrandModel.find();
    
            if (!Brand) {
                return res.status(500).json({
                    error: true, 
                    message: 'Nenhum produto cadastrado! Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false, 
                Brand: Brand,
                token:  req.RefreshToken.JWT
            });

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });

        };
    
    },

    ListOneBrand: async (req, res) => {

        try {

            const Brand = await BrandModel.findById(req.params.id);
    
            if (!Brand) {
                return res.status(500).json({
                    error: true, 
                    message: 'Nenhum produto cadastrado! Tente novamente mais tarde'
                });
            };

            return res.status(200).json({
                error: false, 
                Brand: Brand,
                token:  req.RefreshToken.JWT
            });

        } catch (error) {
            return res.status(500).json({
                error: true, 
                message: error.message
            });

        };

    },

    UpdateBrand: async (req, res) => {
        const { name } = req.body;

        try {
            if (!name) {
                return res.status(401).json({
                    error: true, 
                    message: 'É necessário informar um nome para a nova Categoria'
                });
            };

            if (await BrandModel.findOne({ name })) {
                return res.status(401).json({
                    error: true,
                    message: 'Não é possível cadastrar duas marcas com o mesmo nome'
                });
            };

            const NewBrand = await BrandModel.findByIdAndUpdate(req.params.id, { name }, { new: true });

            if (!NewBrand) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível cadastrar a nova categoria! Tente novamente mais tarde'
                });
            };

            return res.status(201).json({
                error: false,
                Brand: NewBrand,
                token: req.RefreshToken.JWT
            });

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            });
            
        };

    },

    DeleteBrand: async (req, res) => {
        const { NewBrand } = req.body;

        try {

            const BrandFilter = await BrandModel.findById(req.params.id);

            if (!BrandFilter) {
                return res.status(500).json({
                    error: true,
                    message: 'A marca não existe! Tente novamente mais tarde'
                });
            };

            const Products = await ProductModel.find({ brand: BrandFilter._id });

            if (!Products[0]) {
                const BrandRemove = await BrandModel.findByIdAndDelete(req.params.id);

                if (!BrandRemove) {
                    return res.status(500).json({
                        error: true,
                        message: 'Não foi possível remover a marca! Tente novamente mais tarde'
                    });
                };
    
                return res.status(201).json({
                    error: false,
                    message: 'Marca removida com sucesso',
                    token:  req.RefreshToken.JWT
                });

            };

            if (!NewBrand) {
                return res.status(401).json({
                    error: true,
                    message: 'É necessário informar uma nova marca para os produtos antes de deletar a atual'
                });
            };

            await Promise.all(Products.map( async (product) => {
                const NewBrandProduct = await ProductModel.findByIdAndUpdate(product._id, { brand: NewBrand }, { new: true });

                if (!NewBrandProduct) {
                    return res.status(500).json({
                        error: true,
                        message: 'Não foi possível atualizar a marca dos produtos! Tente novamente mais tarde'
                    });
                };

                const AtualizeBrand = await BrandModel.findById(NewBrand);

                if (!AtualizeBrand) {
                    return res.status(500).json({
                        error: true, 
                        message: 'Não foi possível localizar a nova marca! Tente novamente mais tarde'
                    });
                };

                await AtualizeBrand.products.push(NewBrandProduct);
                await AtualizeBrand.save();

            }));

            const BrandRemove = await BrandModel.findByIdAndDelete(req.params.id);

            if (!BrandRemove) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível remover a marca! Tente novamente mais tarde'
                });
            };

            return res.status(201).json({
                error: false,
                message: 'Marca removida com sucesso',
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