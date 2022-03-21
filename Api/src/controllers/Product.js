const ProductModel = require('../models/Product');
const CategoryModel = require('../models/Category');
const BrandModel = require('../models/Brand');

module.exports = {
    CreateNewProduct: async (req, res) => {
        const { name, description, price, category, brand } = req.body;

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

            const AtualizeCategory = await CategoryModel.findById(category);

            if (!AtualizeCategory) {
                return res.status(401).json({
                    error: true,
                    message: 'A categoria informada não existe'
                });
            };

            const AtualizeBrand = await BrandModel.findById(brand);

            if (!AtualizeBrand) {
                return res.status(401).json({
                    error: true,
                    message: 'A marca informada não existe'
                });
            };

            const NewProduct = await ProductModel.create({ 
                name, 
                description, 
                price,
                category, 
                brand
            });

            if (!NewProduct) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível cadastrar um novo produto! Tente novamente mais tarde'
                });
            };

            await AtualizeCategory.products.push(NewProduct);
            await AtualizeCategory.save();

            await AtualizeBrand.products.push(NewProduct);
            await AtualizeBrand.save();

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
            const Product = await ProductModel.find().populate('category brand');
    
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
            const Product = await ProductModel.findById(id).populate('category brand');
    
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
        const { name, description, price, category, brand } = req.body;

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

            const OldProduct = await ProductModel.findById( req.params.id );

            if (!OldProduct) {
                return res.status(400).json({
                    error: true, 
                    message: 'Não existe nenhum produto com o ID informado cadastrado no banco de dados'
                });
            };

            const OldCategory = await CategoryModel.findById(OldProduct.category);

            if (!OldCategory) {
                return res.status(500).json({
                    error: true,
                    message: 'Nenhuma categoria foi cadastrada anteriormente ao produto'
                });
            };

            const PositionProductCategory = await OldCategory.products.indexOf(OldProduct._id)
            await OldCategory.products.splice(PositionProductCategory, 1);
            await OldCategory.save();

            const OldBrand = await BrandModel.findById(OldProduct.brand);

            if (!OldBrand) {
                return res.status(500).json({
                    error: true,
                    message: 'Nenhuma categoria foi cadastrada anteriormente ao produto'
                });
            };

            const PositionProductBrand = await OldBrand.products.indexOf(OldProduct._id)
            await OldBrand.products.splice(PositionProductBrand, 1);
            await OldBrand.save();

            const AtualizeCategory = await CategoryModel.findById(category);

            if (!AtualizeCategory) {
                return res.status(401).json({
                    error: true,
                    message: 'A categoria informada não existe'
                });
            };

            const AtualizeBrand = await BrandModel.findById(brand);

            if (!AtualizeBrand) {
                return res.status(401).json({
                    error: true,
                    message: 'A marca informada não existe'
                });
            };

            const NewProduct = await ProductModel.findByIdAndUpdate(req.params.id, 
                { 
                    name, 
                    description, 
                    price,
                    category,
                    brand 
                    
                }, { new: true }
            );

            if (!NewProduct) {
                return res.status(500).json({
                    error: true, 
                    message: 'Não foi possível cadastrar um novo produto! Tente novamente mais tarde'
                });
            };

            await AtualizeCategory.products.push(NewProduct);
            await AtualizeCategory.save();

            await AtualizeBrand.products.push(NewProduct);
            await AtualizeBrand.save();

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

        try {

            const ProductFilter = await ProductModel.findById( req.params.id );

            if (!ProductFilter) {
                return res.status(400).json({
                    error: true, 
                    message: 'Não existe nenhum produto com o ID informado cadastrado no banco de dados'
                });
            };

            const Category = await CategoryModel.findById(ProductFilter.category);

            if (!Category) {
                return res.status(500).json({
                    error: true,
                    message: 'Nenhuma categoria foi cadastrada anteriormente ao produto'
                });
            };

            const PositionProductCategory = await Category.products.indexOf(ProductFilter._id)
            await Category.products.splice(PositionProductCategory, 1);
            await Category.save();

            const Brand = await BrandModel.findById(ProductFilter.brand);

            if (!Brand) {
                return res.status(500).json({
                    error: true,
                    message: 'Nenhuma categoria foi cadastrada anteriormente ao produto'
                });
            };

            const PositionProductBrand = await Brand.products.indexOf(ProductFilter._id)
            await Brand.products.splice(PositionProductBrand, 1);
            await Brand.save();

            const ProductRemove = await ProductModel.findByIdAndDelete(req.params.id);

            if (!ProductRemove) {
                return res.status(500).json({
                    error: true,
                    message: 'Não foi possível remover o produto! Tente novamente mais tarde'
                });
            };

            return res.status(201).json({
                error: false,
                message: 'Produto removido com sucesso',
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