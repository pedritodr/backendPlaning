const { Router } = require('express');
const { check } = require('express-validator');
const { getPlanings, getPlaningsPage, addPlaning, updatePlaning, deletePlaning } = require('../controllers/planing');
const { existsPlaning, validatePage } = require('../helpers');
const { validJwt, validateFields, validateFileExt } = require('../middlewares');

const router = Router();

router.get('/', getPlanings);

router.get('/:page', [
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