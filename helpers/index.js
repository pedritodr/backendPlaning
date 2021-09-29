const dbValidate = require('./db-validate');
const generateJwt = require('./generate-jwt');
const loadFile = require('./load-file');
const logger = require('./winston');
const typeDocumentHelper = require('./type-documet');

module.exports = {
    ...dbValidate,
    ...generateJwt,
    ...loadFile,
    ...logger,
    ...typeDocumentHelper
}