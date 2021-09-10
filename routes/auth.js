const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login', [
    check('email', 'El email es un campo obligatorio').isEmail(),
    check('password', 'La contraseña es un campo obligatorio').notEmpty(),
    validateFields
], login);

router.post('/google', [
    check('id_token', 'El token es necesario').notEmpty(),
    validateFields
], googleSignin);

module.exports = router;