const videosAPI = require('./videosAPI');
const createTorrent = require('create-torrent');
const fs = require('fs');
const aws = require('aws-sdk');
const config = require('config');



aws.config.update({
	secretAccessKey: config.get("AWS_SECRET_ACCESS"),
	accessKeyId: config.get("AWS_ACCESS_KEY"),
	region: config.get('AWS_REGION')
});

const s3 = new aws.S3();

exports.addVideo = (fileinfo) => {
	return new Promise(async (resolve, reject) => {

		const uploadTorrentFile = (fileinfo) => {
			return new Promise(async (resolve, reject) => {
				createTorrent(fileinfo.path, {},
					async (err, torrent) => {
						if (err) {
							reject({ "TORRENT CREATION ERR:": err })
						} else {
							await s3.upload(
								{
									Bucket: config.get('AWS_BUCKET'),
									Key: 'TORRENTS/' + fileinfo.filename.replace(/\.[^.]+$/, ""),
									Body: torrent,
									StorageClass: "REDUCED_REDUNDANCY",
									ACL: 'public-read'
								}, async (err, data) => {
									if (err) {
										throw err;
									}
									resolve(data.Location);
								})
						}
					})
			})
		}
		resolve(await videosAPI.addVideo({
			filename: fileinfo.filename,
			adsCount: fileinfo.adsCount,
			description: fileinfo.description,
			fileURL: fileinfo.fileURL,
			coverURL: fileinfo.coverURL,
			videoname: fileinfo.videoname,
			duration: fileinfo.duration,
			torrentURL: await uploadTorrentFile(fileinfo),
			creatorID: fileinfo.userID,
			channelName: fileinfo.channelName,
			creationDate: await Date.now(),
			tags: fileinfo.tags,
			likedBy: [],
			dislikedBy: []
		}))
		fs.unlink(fileinfo.path, (err) => {
			if (err) console.log("TMP File delete failed:", err)
		})
		console.log('Uploaded video:', fileinfo.originalname, 'with filename:', fileinfo.filename);
	})
}
