const { Schema, model } = require('mongoose');

const roleSchema = new Schema({
    rol: {
        type: String,
        require: [true, 'El rol es un campo obligatorio']
    }
}, {
    collection: 'role'
});
module.exports = model('role', roleSchema);