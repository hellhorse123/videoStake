const mongoose = require('mongoose');
const Video = require('../models/videos');

exports.connectDB = async (dbURL) => {
	await mongoose.connect(dbURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	})
}
exports.addVideo = (videoData) => {
	return new Video(videoData).save();
}

exports.isVideoExists = async (videoID) => {
	try {
		return Video.exists({ "_id": videoID });
	} catch (e) {
		return false;
	}
}

exports.getRandomVideos = async (count, filter = undefined) => {
	return Video.aggregate(filter ? [{ $match: filter }, { $sample: { size: count } }] : [{ $sample: { size: count } }]);
}

exports.updateVideo = async (videoData) => {
	//return Video.update({_id: videoData._id}, {$set: {videoData}});
	return await Video.updateOne({ _id: videoData._id }, videoData, { new: true });
}

exports.addViewsCount = async (data) => {
	await Video.updateOne({ _id: data._id }, { views: data.views + 1 });
}

exports.getVideo = async (id) => {
	video = await Video.findById(id).lean();
	return video
}

exports.videoList = async (filter) => {
	return await Video.find(filter).lean();
}


