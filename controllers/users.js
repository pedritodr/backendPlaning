const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const usersGet = async(req, res = response) => {
    const { limit = 5, offset = 0 } = req.query;


    const [users, total] = await Promise.all([
        User.find({ status: true })
        .skip(Number(offset))
        .limit(Number(limit)),
        User.countDocuments({ status: true })
    ])
    res.json({
        total,
        users
    })
}

const usersPost = async(req, res = response) => {

    const { name, role, email, password, } = req.body;
    const user = new User({ name, role, email, password });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();
    res.json(user);
}

const usersPut = async(req, res = response) => {
    const { id } = req.params;
    const { password, email, google, ...userUpdate } = req.body;
    if (password) {
        const salt = bcryptjs.genSaltSync();
        userUpdate.password = bcryptjs.hashSync(password, salt);
    }
    const user = await User.findByIdAndUpdate(id, userUpdate);
    res.json(user);
}

const usersDelete = async(req, res = response) => {
    const { id } = req.params;
    //const userDelete = await User.findByIdAndDelete(id);
    const userDelete = await User.findByIdAndUpdate(id, { status: false });
    res.json({ userDelete });
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: "Patch app controlador"
    })
}


module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete,
    usersPatch
}