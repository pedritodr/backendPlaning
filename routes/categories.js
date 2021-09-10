const { Router } = require('express');
const { check } = require('express-validator');
const { addCategory, getCategoryById, getCategories, updateCategory, deleteCategory } = require('../controllers/categories');
const { validJwt, validateFields, isAdminRol } = require('../middlewares');
const { existsCategory } = require('../helpers/db-validate')

const router = Router();
//todas las categorias publico
router.get('/', getCategories);

//obtiene una categoria por Id
router.get('/:id', [
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsCategory),
    validateFields
], getCategoryById);

//add caterogia privado token valido cualquier rol
router.post('/', [validJwt,
    check('name', 'EL nombre es un campo obligatorio').notEmpty(),
    validateFields
], addCategory);

//update categoria privado token valido cualquier rol
router.put('/:id', [
    validJwt,
    check('name', 'EL nombre es un campo obligatorio').notEmpty(),
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsCategory),
    validateFields
], updateCategory);

//delete categoria privado token valido rol admin
router.delete('/:id', [
    validJwt,
    isAdminRol,
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsCategory),
    validateFields
], deleteCategory);
module.exports = router;