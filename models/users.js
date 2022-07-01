const { Schema, model } = require('mongoose');

const User = new Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	nickname: {
		type: String,
		required: true,
		unique: true
	},
	dateOfBirth: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	cardNumber: {
		type: String,
		default: '',
	},
	interests: [
		{
			tag: {
				type: String
			},
			count: {
				type: Number
			}
		}
	],
	historyVideoIds: [
		{
			type: String
		}
	],
	favoritesIds: [
		{
			type: String
		}
	],
	likedIds: [
		{
			type: String
		}
	],
	dislikedIds: [
		{
			type: String
		}
	],
	subscribes: [
		{
			type: String
		}
	],
	subscribers: [
		{
			type: String
		}
	],
	commercialViewsPerPeriod: [ //VideoId
		{
			year: {
				type: Number,
			},
			month: {
				type: Number,
			},
			videoIds: [
				{
					type: String,
				}
			]
		}
	]

})

module.exports = model("Users", User);