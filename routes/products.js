const { Router } = require('express');
const { check } = require('express-validator');

const { validJwt, validateFields, isAdminRol } = require('../middlewares');
const { existsCategory, existsProduct } = require('../helpers/db-validate');
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/products');

const router = Router();
//todas las categorias publico
router.get('/', getProducts);

//obtiene una categoria por Id
router.get('/:id', [
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsProduct),
    validateFields
], getProductById);

//add caterogia privado token valido cualquier rol
router.post('/', [validJwt,
    check('name', 'EL nombre es un campo obligatorio').notEmpty(),
    check('category', 'La categoria es un campo obligatorio').notEmpty(),
    check('category').custom(existsCategory),
    validateFields
], addProduct);

//update categoria privado token valido cualquier rol
router.put('/:id', [
    validJwt,
    check('name', 'EL nombre es un campo obligatorio').notEmpty(),
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsProduct),
    check('category', 'La categoria es un campo obligatorio').notEmpty(),
    check('category').custom(existsCategory),
    validateFields
], updateProduct);

//delete categoria privado token valido rol admin
router.delete('/:id', [
    validJwt,
    isAdminRol,
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsProduct),
    validateFields
], deleteProduct);
module.exports = router;