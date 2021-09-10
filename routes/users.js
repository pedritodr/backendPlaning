const { Router } = require('express');
const { check } = require('express-validator');

const { usersGet, usersPut, usersPost, usersDelete, usersPatch } = require('../controllers/users');
const { isRoleValidate, emailExists, existsId } = require('../helpers/db-validate');

const { validateFields, validJwt, isAdminRol, isRolesValid } = require('../middlewares');

const router = Router();

router.get('/', usersGet);

router.put('/:id', [
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsId),
    check('role').custom(isRoleValidate),
    validateFields,
], usersPut);

router.post('/', [
    check('name', 'el nombre es obligatorio').not().isEmpty(),
    check('email', 'el email no es valido').isEmail(),
    check('email').custom(emailExists),
    check('password', 'El password tiene que ser minimo de 6 caracteres').isLength({ min: 6 }),
    // check('role', 'Role no permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(isRoleValidate),
    validateFields,
], usersPost);

router.delete('/:id', [
    validJwt,
    //isAdminRol,
    isRolesValid('ADMIN_ROLE', 'VENTA_ROLE'),
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsId),
    validateFields,
], usersDelete);

router.patch('/', usersPatch);


module.exports = router;