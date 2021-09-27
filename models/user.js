const { Schema, model } = require('mongoose');

const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es un campo obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es un campo obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    }
});

userSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    return user;
}

module.exports = model('User', userSchema);