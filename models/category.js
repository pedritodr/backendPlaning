const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
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
    }
});
categorySchema.methods.toJSON = function() {
    const { __v, _id, status, ...category } = this.toObject();
    return category;
}
module.exports = model('Category', categorySchema);