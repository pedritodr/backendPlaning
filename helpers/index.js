const dbValidate = require('./db-validate');
const generateJwt = require('./generate-jwt');
const loadFile = require('./load-file');

module.exports = {
    ...dbValidate,
    ...generateJwt,
    ...loadFile
}