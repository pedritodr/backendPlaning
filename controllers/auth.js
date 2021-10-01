const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJwt } = require('../helpers/generate-jwt');

const login = async(req, res = response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        //valida si el user existe
        if (!user) {
            return res.status(400).json({
                msg: 'User / password no son correctos - email'
            });
        }
        //valida si esta activo
        if (!user.status) {
            return res.status(400).json({
                msg: 'User / password no son correctos - status:false'
            });
        }
        //valida la constrasena

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'User / password no son correctos - password'
            });
        }
        //generate jwt
        const token = await generateJwt(user.id);

        res.json({
            msg: 'login ok',
            user,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Ocurrió un error cotactarse con el administrador'
        });
    }

}


module.exports = {
    login
}