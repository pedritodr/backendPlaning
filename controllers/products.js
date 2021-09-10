const { response } = require('express');
const { Product } = require('../models');

const getProducts = async(req, res) => {
    const { limit = 5, offset = 0 } = req.query;
    const [products, total] = await Promise.all([
        Product.find({ status: true })
        .skip(Number(offset))
        .limit(Number(limit))
        .populate('user', 'name')
        .populate('category', 'name'),
        Product.countDocuments({ status: true })
    ])
    res.json({
        total,
        products
    })

}

const getProductById = async(req, res) => {

    const { id } = req.params;
    const product = await Product.findById(id).populate('user', 'name').populate('category', 'name');
    res.json(product);
}

const addProduct = async(req, res = response) => {
    const name = req.body.name.toUpperCase();
    const { status, user, ...body } = req.body;
    const productDB = await Product.findOne({ name });
    if (productDB) {
        return res.status(400).json({
            msg: `La categoria: ${name}, ya existe en la DB`
        });
    }
    body.user = req.user._id
    body.name = name;
    const product = new Product(body);
    await product.save();

    return res.json({
        product
    })
}

const updateProduct = async(req, res) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;
    if (data.name) {
        data.name = data.name.toUpperCase();
    }
    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    res.json(product);

}

const deleteProduct = async(req, res) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

    return res.json(product);

}

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProducts
}