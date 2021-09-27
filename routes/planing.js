const { Router } = require('express');
const { check } = require('express-validator');
const { getPlanings, addPlaning, updatePlaning, deletePlaning } = require('../controllers/planing');
const { existsId } = require('../helpers');
const { validJwt, validateFields, validateFileExt } = require('../middlewares');

const router = Router();

router.get('/', getPlanings);

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
    check('id').custom(existsId),
    validateFields,
], updatePlaning);

router.delete('/:id', [
    validJwt,
    check('id', 'El ID no válido').isMongoId(),
    check('id').custom(existsId),
    validateFields,
], deletePlaning);




module.exports = router;