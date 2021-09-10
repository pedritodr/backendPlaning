const path = require('path');
const { v4: uuidv4 } = require('uuid');

const loadFileHelper = (files, extesionsValids = ['jpg', 'png', 'jpeg', 'gif'], folder = '') => {
    return new Promise((resolve, reject) => {
        const file = files.file;
        const stringFile = file.name.split('.');
        const extension = stringFile[stringFile.length - 1];

        if (!extesionsValids.includes(extension)) {
            return reject(`La extension ${extension} no es valida, ${extesionsValids}`);
        }

        const nameTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, nameTemp);

        file.mv(uploadPath, function(err) {
            if (err) {
                return reject(err);
            }
            resolve(nameTemp);
        });
    })

}

module.exports = {
    loadFileHelper
}