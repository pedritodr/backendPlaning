const validateFields = require('../middlewares/validate-fields');
const validateJwt = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-roles');
const validateFile = require('../middlewares/validate-file');
const validateFileExt = require('../middlewares/validate-ext');

module.exports = {
    ...validateFields,
    ...validateJwt,
    ...validateRoles,
    ...validateFile,
    ...validateFileExt
}