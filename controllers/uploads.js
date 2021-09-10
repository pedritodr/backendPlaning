const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.cloudinary);

const { response } = require("express");
const { loadFileHelper } = require('../helpers');
const { User, Product } = require('../models');


const loadFile = async(req, res = response) => {


    try {
        const name = await loadFileHelper(req.files, undefined, 'imgs');
        res.json({
            name
        })
    } catch (msg) {
        res.status(400).json({
            msg
        })
    }


}

const loadFileUserImg = async(req, res = response) => {

    const { collection, id } = req.params;
    let model;
    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                res.status(400).json({
                    msg: `No existe un usuario registrado con el id ${id}`
                })
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                res.status(400).json({
                    msg: `No existe un producto registrado con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'No esta validado'
            })
    }
    if (model.img) {
        const pathImg = path.join(__dirname, '../uploads/', collection, model.img);
        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg);
        }
    }

    const name = await loadFileHelper(req.files, undefined, collection);
    model.img = name;
    await model.save()
    res.json({
        model
    })
}

const showImg = async(req, res = response) => {
    const { collection, id } = req.params;
    let model;
    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                res.status(400).json({
                    msg: `No existe un usuario registrado con el id ${id}`
                })
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                res.status(400).json({
                    msg: `No existe un producto registrado con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'No esta validado'
            })
    }

    if (model.img) {
        const pathImg = path.join(__dirname, '../uploads/', collection, model.img);
        if (fs.existsSync(pathImg)) {
            return res.sendFile(pathImg);
        }
    }

    const pathPlaceHolder = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathPlaceHolder);
}

const cloudinayUpdateUserProduct = async(req, res = response) => {

    const { collection, id } = req.params;
    let model;
    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                res.status(400).json({
                    msg: `No existe un usuario registrado con el id ${id}`
                })
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                res.status(400).json({
                    msg: `No existe un producto registrado con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'No esta validado'
            })
    }
    if (model.img) {
        const nameArr = model.img.split('/');
        const nameFile = nameArr[nameArr.length - 1];
        const [public_id] = nameFile.split('.');
        cloudinary.uploader.destroy(public_id);
    }
    const { tempFilePath } = req.files.file;

    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    model.img = secure_url;
    await model.save()
    res.json({
        model
    })
}


module.exports = {
    loadFile,
    loadFileUserImg,
    showImg,
    cloudinayUpdateUserProduct
}