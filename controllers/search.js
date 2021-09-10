const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const { User, Category, Product } = require('../models')
const collectionValid = [
    'categories',
    'products',
    'users',
    'roles'
];

const searchUsers = async(criterion = '', res = response) => {
    const isMongoId = isValidObjectId(criterion);
    if (isMongoId) {
        const user = await User.findById(criterion);
        return res.json({
            results: (user) ? [user] : []
        })
    }

    const regex = new RegExp(criterion, 'i');

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    })

    res.json({
        results: users
    })
}


const searchCategories = async(criterion = '', res = response) => {
    const isMongoId = isValidObjectId(criterion);
    if (isMongoId) {
        const category = await Category.findById(criterion);
        return res.json({
            results: (category) ? [category] : []
        })
    }

    const regex = new RegExp(criterion, 'i');

    const categories = await User.find({ name: regex, status: true });

    res.json({
        results: categories
    })
}

const searchProducts = async(criterion = '', res = response) => {
    const isMongoId = isValidObjectId(criterion);
    if (isMongoId) {
        const product = await (await Product.findById(criterion)).populate('category', 'name');
        return res.json({
            results: (product) ? [product] : []
        })
    }

    const regex = new RegExp(criterion, 'i');

    const products = await Product.find({ name: regex, status: true }).populate('category', 'name');

    res.json({
        results: products
    })
}

const search = (req, res = response) => {

    const { collection, criterion } = req.params;

    if (!collectionValid.includes(collection)) {
        res.status(400).json({
            msg: `Las colecciones permitidas son: ${collectionValid}`
        })
    }

    switch (collection) {
        case 'categories':
            searchCategories(criterion, res);
            break;
        case 'products':
            searchProducts(criterion, res);
            break;
        case 'users':
            searchUsers(criterion, res);
            break;
        default:
            res.status(500).json({
                msg: 'Falta este caso'
            })
    }
}

module.exports = {
    search
}