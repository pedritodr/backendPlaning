const { Router } = require('express');
const { check } = require('express-validator');
const { getPlanings, updatePlaning, deletePlaning } = require('../controllers/planing');
const { existsId } = require('../helpers');
const { validJwt, validateFields, isAdminRol } = require('../middlewares');

const router = Router();

router.get('/', getPlanings);

router.put('/:id', [
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsId),
    validateFields,
], updatePlaning);

router.post('/', [
    check('name', 'el nombre es obligatorio').not().isEmpty(),
    check('email', 'el email no es valido').isEmail(),
    check('email').custom(emailExists),

    validateFields,
], updatePlaning);

router.delete('/:id', [
    validJwt,
    //isAdminRol,
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsId),
    validateFields,
], deletePlaning);




module.exports = router;