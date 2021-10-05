const { response } = require('express');
const { Planing } = require('../models');
const { loadFileHelper } = require('../helpers');

const getPlanings = async(req, res) => {
    const { limit = 5, offset = 0 } = req.query;
    const [planings, total] = await Promise.all([
        Planing.find({ status: true })
        .skip(Number(offset))
        .limit(Number(limit))
        .populate('user', 'name'),
        Planing.countDocuments({ status: true })
    ])
    res.json({
        total,
        planings
    })

}

const getPlaningsPage = async(req, res) => {

    const limit = 10;
    const { page } = req.params;
    const offset = limit * (Number(page) - 1);
    const [planings, total] = await Promise.all([
        Planing.find({ status: { $ne: -1 } })
        .skip(Number(offset))
        .limit(Number(limit))
        .populate('user', 'name'),
        Planing.countDocuments({ status: { $ne: -1 } })
    ])

    const totalPage = Math.ceil(total / limit);
    res.json({
        total,
        per_page: limit,
        page: Number(page),
        total_pages: totalPage,
        planings
    })

}

const getPlaningById = async(req, res) => {

    const { id } = req.params;
    const planing = await Planing.findById(id).populate('user', 'name');
    res.json(product);
}

const addPlaning = async(req, res = response) => {

    const { date_begin, date_end, output_format, document_type } = req.body;
    const user = req.user._id;
    const secuential = await loadFileHelper(req.files, ['csv'], 'cvss');
    const planing = new Planing({ secuential, date_begin, date_end, output_format, document_type, user });
    await planing.save();
    return res.json({
        planing
    })
}

const updatePlaning = async(req, res) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    data.user = req.user._id;

    const planing = await Planing.findByIdAndUpdate(id, data, { new: true });
    res.json(planing);

}

const deletePlaning = async(req, res) => {
    const { id } = req.params;

    const planing = await Planing.findByIdAndUpdate(id, { status: -1 }, { new: true });

    return res.json(planing);

}

module.exports = {
    addPlaning,
    updatePlaning,
    deletePlaning,
    getPlaningById,
    getPlanings,
    getPlaningsPage
}