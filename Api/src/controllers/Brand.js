const BrandModel = require('../models/Brand');

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

            const NewBrand = await BrandModel.findByIdAndUpdate(req.params.id, { name });

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

    }

};