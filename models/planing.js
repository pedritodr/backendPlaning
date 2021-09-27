const { Schema, model } = require('mongoose');

const planingSchema = new Schema({
    secuential: {
        type: String,
        require: true
    },
    status: {
        type: Number,
        default: 0,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    date_create: {
        type: Date,
    },
    date_begin: {
        type: Date,
        require: true
    },
    date_end: {
        type: Date,
        require: true
    },
    output_format: {
        type: Number,
        require: true
    },
    document_type: {
        type: Number,
        require: true
    }
}, {
    collection: 'planing'
});
planingSchema.methods.toJSON = function() {
    const { __v, _id, status, ...planing } = this.toObject();
    return planing;
}
module.exports = model('planing', planingSchema);