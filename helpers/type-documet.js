const arrTypeDocument = [
    { type: '01', document: 'Factura' },
    { type: '03', document: 'LC' },
    { type: '04', document: 'NC' },
    { type: '05', document: 'ND' },
    { type: '06', document: 'GR' },
    { type: '07', document: 'CR' }
];

const searchTypeDocument = (type = '') => {
    return arrTypeDocument.find(element => element.type === type);
}

module.exports = searchTypeDocument;