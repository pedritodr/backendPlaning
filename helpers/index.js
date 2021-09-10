const dbValidate = require('./db-validate');
const generateJwt = require('./generate-jwt');
const googleVerify = require('./google-verify');
const loadFile = require('./load-file');

module.exports = {
    ...dbValidate,
    ...generateJwt,
    ...googleVerify,
    ...loadFile
}