const {Schema, model} = require('mongoose');

const Block = new Schema({
    index: {
        type: Number,
        required: true,
        unique: true
    },
    timestamp: {
        type: Number,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true,
    },
    videoId: {
        type: String,
        required: true,
    },
    isCommercial: {
        type: Boolean,
        required: true,
    },
    precedingHash: {
        type: String,
        required: true,
        unique: true
    },
    hash: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = model("Blocks", Block);



