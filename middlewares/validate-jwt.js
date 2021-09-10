const { request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validJwt = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token'
        });
    }
    try {
        const { uid } = jwt.verify(token, process.env.KEYSECURITY);

        const user = await User.findById(uid);
        if (!user) {
            return json.status(401).json({
                msg: 'User no existe en base de datos'
            });
        }
        //verificar status
        if (!user.status) {
            return json.status(401).json({
                msg: 'User status:false'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "Token no valido"
        });
    }

}

module.exports = {
    validJwt
}