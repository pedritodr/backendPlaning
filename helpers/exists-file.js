const fs = require('fs');
const path = require('path');

const existFile = (id) => {

    const downloadPath = path.join(__dirname, '../logs/', `planing-${id}.log`);
    try {
        fs.statSync(downloadPath).isFile();
        return true;
    } catch (e) {
        throw new Error(`there is no log associated with this id: ${id}`);
    }

}

module.exports = {
    existFile
}