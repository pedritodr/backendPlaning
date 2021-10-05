const { Category, Planing, Role, User } = require('../models');

const isRoleValidate = async(rol = '') => {
    const existsRole = await Role.findOne({ rol });
    if (!existsRole) {
        throw new Error(`${rol} no esta registrado en la base de datos`);
    }
}

const emailExists = async(email = '') => {
    const existsEmail = await User.findOne({ email });
    if (existsEmail) {
        throw new Error(`El email ${email} ya esta registrado en la base de datos`);
    }
}

const existsId = async(id) => {
    const existsUserById = await User.findById(id);
    if (!existsUserById) {
        throw new Error(`El id no existe ${id}`);
    }
}

const existsPlaning = async(id) => {
    const existsPlaningById = await Planing.findById(id);
    if (!existsPlaningById) {
        throw new Error(`El id no existe ${id}`);
    }
}

const existsCategory = async(id) => {
    const category = await Category.findById(id);
    if (!category) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }
}

const existsProduct = async(id) => {
    const product = await Product.findById(id);
    if (!product) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }
}

const validCollection = (collection = '', collectionValids = []) => {

    const include = collectionValids.includes(collection);
    if (!include) {
        throw new Error(`La colección ${collection} no es permitida, permitidas ${collectionValids}`);
    }
    return true;
}



module.exports = {
    isRoleValidate,
    emailExists,
    existsId,
    existsCategory,
    existsProduct,
    validCollection,
    existsPlaning
}