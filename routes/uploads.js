const { Router } = require('express');
const { check } = require('express-validator');
const { loadFile, showImg, cloudinayUpdateUserProduct } = require('../controllers/uploads');
const { validCollection } = require('../helpers');
const { validateFields, validateFileSubmit } = require('../middlewares');

const router = Router();

router.post('/', validateFileSubmit, loadFile);

router.put('/:collection/:id', [
    validateFileSubmit,
    check('id', 'El id tiene que ser de mongo').isMongoId(),
    check('collection').custom(c => validCollection(c, ['products', 'users'])),
    validateFields
], cloudinayUpdateUserProduct);
//loadFileUserImg
router.get('/:collection/:id', [
    check('id', 'El id tiene que ser de mongo').isMongoId(),
    check('collection').custom(c => validCollection(c, ['products', 'users'])),
    validateFields
], showImg);


module.exports = router;