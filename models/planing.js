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
        default: new Date().toString()
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
        type: String,
        require: true
    },
    time: {
        type: Number,
        default: (new Date()).getTime()
    },
    date_process: {
        type: Date,
        defaul: ''
    },
    date_culminated: {
        type: Date,
        defaul: ''
    }
}, {
    collection: 'planing'
});
planingSchema.methods.toJSON = function() {
    const { __v, ...planing } = this.toObject();
    return planing;
}
module.exports = model('planing', planingSchema);