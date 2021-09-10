const jwt = require('jsonwebtoken');

const generateJwt = (uid) => {

    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.KEYSECURITY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('NO SE PUDO GENERAR EL TOKEN')
            } else {
                resolve(token);
            }
        })

    });
}

module.exports = {
    generateJwt
}