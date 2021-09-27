const { response } = require("express");


const validateFileExt = (req, res = response, next) => {

    const file = req.files.secuential.name;
    if (!req.files) {
        return res.status(400).json({
            msg: 'no file uploaded'
        });
    }
    const extesionsValids = ['csv', 'png'];
    const extArr = file.split('.');
    const ext = extArr[extArr.length - 1];
    const include = extesionsValids.includes(ext.trim());
    if (!include) {
        return res.status(400).json({
            msg: `The extension ${ext} it is not allowed, allowed ${extesionsValids}`
        });
    }

    next();
}

module.exports = {
    validateFileExt
}