const mongoose = require('mongoose');
const Comment = require('../models/comments');

exports.connectDB = async (dbURL) => {
    await mongoose.connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
}

exports.addComment = (commentData) => {
    const comment = {
        videoID: commentData.videoID,
        commentatorID: commentData.commentatorID,
        data: commentData.data,
        commentatorNickname: commentData.commentatorNickname
    };
    return new Comment(comment).save();
}

exports.deleteComment = (commentID) => {

}

exports.getComment = async (id) => {
    const comment = await Comment.findById(id).lean();
    return comment
}

exports.getComments = async (filter) => {
    return await Comment.find(filter).lean();
}


