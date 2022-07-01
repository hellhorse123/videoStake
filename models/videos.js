const { Schema, model } = require('mongoose');

const Video = new Schema({
	videoname: {
		type: String,
		required: true
	},
	adsCount: {
		type: Number
	},
	views: {
		type: Number,
		default: 0
	},
	filename: {
		type: String,
		required: true,
		unique: true
	},
	fileURL: {
		type: String,
		required: true,
		unique: true
	},
	coverURL: {
		type: String,
		required: true,
		unique: true
	},
	torrentURL: {
		type: String,
		required: true,
		unique: true
	},
	likedBy: [
		{
			type: String
		}
	],
	dislikedBy: [
		{
			type: String
		}
	],
	duration: {
		type: Number,
		required: true
	},
	creatorID: {
		type: String,
		required: true
	},
	channelName: {
		type: String,
		required: true
	},
	description: {
		type: String,
	},
	creationDate: {
		type: Number,
		required: true
	},
	tags: [
		{ type: String }
	],
	commercialViewsPerPeriod: [ //UserId
		{
			year: {
				type: Number,
			},
			month: {
				type: Number,
			},
			userIds: [
				{
					type: String,
				}
			]
		}
	]

})

module.exports = model("Videos", Video);