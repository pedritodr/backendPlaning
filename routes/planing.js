const { Router } = require('express');
const { check } = require('express-validator');
const { getPlanings, getPlaningsPage, addPlaning, updatePlaning, deletePlaning, getPlaningById, downloadLog } = require('../controllers/planing');
const { existsPlaning, validatePage, existFile } = require('../helpers');
const { validJwt, validateFields, validateFileExt } = require('../middlewares');

const router = Router();

router.get('/app/', getPlanings);

router.get('/:id', [
    validJwt,
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsPlaning),
    validateFields,
], getPlaningById);

router.get('/download/:id', [
    validJwt,
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsPlaning),
    check('id').custom(existFile),
    validateFields,
], downloadLog);

router.get('/paginate/:page', [
    validJwt,
    check('page', 'the page is required').not().isEmpty(),
    check('page', 'the page has to be a number').isNumeric(),
    check('page').custom(validatePage),
    validateFields,
], getPlaningsPage);

router.post('/', [
    validJwt,
    check('date_begin', 'the start date is required').not().isEmpty(),
    check('date_end', 'the end date is required').not().isEmpty(),
    check('output_format', 'the output format').not().isEmpty(),
    check('document_type', 'the type of document').not().isEmpty(),
    validateFileExt,
    validateFields,
], addPlaning);

router.put('/:id', [
    validJwt,
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsPlaning),
    validateFields,
], updatePlaning);

router.delete('/:id', [
    validJwt,
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsPlaning),
    validateFields,
], deletePlaning);




module.exports = router;