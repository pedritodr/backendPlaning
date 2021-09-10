const { Schema, model } = require('mongoose');

const roleSchema = new Schema({
    role: {
        type: String,
        require: [true, 'El rol es un campo obligatorio']
    }
});

module.exports = model('role', roleSchema);