const dbValidate = require('./db-validate');
const generateJwt = require('./generate-jwt');
const loadFile = require('./load-file');
const logger = require('./log4');
const typeDocumentHelper = require('./type-documet');
const validatePage = require('./page-validate');
const existFile = require('./exists-file');

module.exports = {
    ...dbValidate,
    ...generateJwt,
    ...loadFile,
    ...logger,
    ...typeDocumentHelper,
    ...validatePage,
    ...existFile
}