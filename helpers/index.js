const dbValidate = require('./db-validate');
const generateJwt = require('./generate-jwt');
const loadFile = require('./load-file');
const logger = require('./winston');

module.exports = {
    ...dbValidate,
    ...generateJwt,
    ...loadFile,
    ...logger
}