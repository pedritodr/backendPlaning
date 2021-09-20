const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login', [
    check('email', 'El email es un campo obligatorio').isEmail(),
    check('password', 'La contraseña es un campo obligatorio').notEmpty(),
    validateFields
], login);

module.exports = router;