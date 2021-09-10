const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJwt } = require('../helpers/generate-jwt');
const { verifyIdToken } = require('../helpers/google-verify');

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

const googleSignin = async(req, res = response) => {
    const { id_token } = req.body;

    try {
        const { name, email, img } = await verifyIdToken(id_token);

        let user = await User.findOne({ email });
        if (!user) {
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true
            }
            user = new User(data);
            await user.save();
        }
        if (!user.status) {
            res.status(401).json({
                msg: 'hable con el administrador , usuario bloquedo'
            })
        }

        const token = await generateJwt(user.id);
        res.json({
            user,
            token
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no válido'
        })
    }

}

module.exports = {
    login,
    googleSignin
}