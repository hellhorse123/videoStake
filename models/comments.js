const {Schema, model} = require('mongoose');

const Comment = new Schema({
    commentatorID:{
        type: String,
        required: true
    },
    commentatorNickname:{
        type: String,
        required: true
    },
    videoID:{
        type: String,
        required: true
    },
    data:{
        type: String,
        required: true,
    }
})

module.exports = model("Comments", Comment);