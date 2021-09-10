const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    name: {
        type: String,
        require: [true, 'El nombre es un campo obligatorio'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    price: {
        type: Number,
        default: 0
    },
    description: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
});
productSchema.methods.toJSON = function() {
    const { __v, _id, status, ...product } = this.toObject();
    return product;
}
module.exports = model('product', productSchema);