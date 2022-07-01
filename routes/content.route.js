const { Router, json } = require('express');
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const config = require('config');
const videosAPI = require('../utils/videosAPI');
const multer = require("multer");
const crypto = require("crypto");
const torrentAPI = require('../utils/torrentAPI');
const passport = require('passport');
const Ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const aws = require('aws-sdk');
const authAPI = require('../utils/authAPI');
const searchAPI = require('../utils/searchAPI');

Ffmpeg.setFfmpegPath(config.get("ffmpegDir"));
Ffmpeg.setFfprobePath(config.get("ffprobeDir"));

const { ensureAuthenticated } = require('../utils/authUtils/auth');

const router = Router();
router.use(json())

aws.config.update({
	secretAccessKey: config.get("AWS_SECRET_ACCESS"),
	accessKeyId: config.get("AWS_ACCESS_KEY"),
	region: config.get('AWS_REGION')
});

const s3 = new aws.S3();

const storageConfig = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "DATA/tmp/");
	},
	filename: (req, file, cb) => {
		cb(null, crypto.randomBytes(16).toString("hex") + `.${file.mimetype.slice(6)}`);
	}
});
// определение фильтра
const fileFilter = (req, file, cb) => {
	if (file.mimetype === "video/mp4" || file.mimetype === "video/avi" || file.mimetype === "video/webm") {
		cb(null, true);
	}
	else {
		cb(null, false);
	}
}

const upload = multer({ storage: storageConfig, fileFilter: fileFilter }).single("filedata");

router.use(session({
	secret: 'LolIDK',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		url: config.get('dbURL')
	})
}))

router.use(passport.initialize());
router.use(passport.session());


router.get('/api/videos/feed', async (req, res) => {

	const getFilerFromUserInterests = async (interests) => {
		const query = await interests.reduce((acc, current) => {
			return acc + `${current.tag}+`;
		}, [])

		return await searchAPI.findByQuery(query);
	}

	let filter = {};

	if (req.session && req.session.passport && req.session.passport.user) {
		const user = await authAPI.getUser({ _id: req.session.passport.user });
		if (user.interests && user.interests.length > 0) {
			filter = await getFilerFromUserInterests(user.interests);
		}
	}

	const videos = await videosAPI.getRandomVideos(100, filter);
	res.status(200).send(JSON.stringify(videos));



})

router.get('/api/search/:query', async (req, res) => {
	const videos = await videosAPI.videoList(await searchAPI.findByQuery(req.params.query));
	await videos;
	console.log(videos)


	if (req.session.user) {
		res.status(200).send(JSON.stringify(videos));
	} else {

		res.status(200).send(JSON.stringify(videos));
	}
})


router.get('/api/video/:videoID', async (req, res) => {
	try {
		let video = await videosAPI.getVideo(req.params.videoID);
		videosAPI.addViewsCount({ _id: video._id, views: video.views });
		if (req.session && req.session.passport && req.session.passport.user) {
			const user = await authAPI.getUser({ _id: req.session.passport.user });
			video.tags.map((tag) => {
				if (user.interests && user.interests.filter(interest => interest.tag === tag).length !== 0) {
					user.interests.find(interest => interest.tag === tag).count += 1;
				} else {
					user.interests.push({
						tag: tag,
						count: 1
					})
				}
			})

			authAPI.updateUser(user);
		}
	} catch (e) {
		console.log("Asked video", req.params.videoID, "but it isn't found!")
		res.status(404).send("There is no such video!");
		return;
	}
	res.status(200).send(JSON.stringify(video));
})

router.post('/api/video/like', ensureAuthenticated, async (req, res) => {
	try {
		let video = await videosAPI.getVideo(req.body.videoID);
		const userID = req.session.passport.user;
		const user = await authAPI.getUser({ "_id": userID });

		if (!(video.likedBy.includes(userID))) {
			video.likedBy.push(userID)
			user.likedIds.push(video._id);

			if (video.dislikedBy.includes(userID)) {
				video.dislikedBy = video.dislikedBy.filter(item => item !== userID);
				user.dislikedIds = user.dislikedIds.filter(item => item !== video._id);

			}
		} else {
			video.likedBy = video.likedBy.filter(item => item !== userID);
			user.likedIds = user.likedIds.filter(item => item !== video._id);

		}


		videosAPI.updateVideo(video);
		authAPI.updateUser(user);
	} catch (e) {
		console.log("Asked video", req.params.videoID, "but it isn't found!")
		res.status(404).send("There is no such video!");
		return;
	}
	res.status(200).send(JSON.stringify("Success"));
})

router.post('/api/video/dislike', ensureAuthenticated, async (req, res) => {

	try {
		let video = await videosAPI.getVideo(req.body.videoID);
		const userID = req.session.passport.user;
		const user = await authAPI.getUser({ "_id": userID });
		if (!(video.dislikedBy.includes(userID))) {
			video.dislikedBy.push(userID)
			user.dislikedIds.push(video._id);
			if (video.likedBy.includes(userID)) {
				video.likedBy = video.likedBy.filter(item => item !== userID);
				user.likedIds = user.likedIds.filter(item => item !== video._id);
			}
		} else {
			video.dislikedBy = video.dislikedBy.filter(item => item !== userID);
			user.dislikedIds = user.dislikedIds.filter(item => item !== video._id);

		}


		videosAPI.updateVideo(video);
		authAPI.updateUser(user);
	} catch (e) {
		throw e;
		console.log("Asked video", req.params.videoID, "but it isn't found!", e)
		res.status(404).send("There is no such video!");
		return;
	}
	res.status(200).send(JSON.stringify("Success"));
})

router.get("/api/videos/by/:creatorId", async (req, res) => {
	try {
		const videoList = await videosAPI.videoList({ $or: [{ creatorID: req.params.creatorId }, { channelName: req.params.creatorId }] });
		if (videoList.length === 0) {
			throw "There is no videos";
		}

		res.status(200).send(JSON.stringify(videoList));
	} catch (e) {
		res.status(404).send(JSON.stringify({ err: e }));
	}
})

router.post("/api/videos/upload", ensureAuthenticated, upload, async (req, res, next) => {

	const upload = async (req) => {
		return new Promise(async (resolve, reject) => {
			try {
				if (!req.file) {
					reject({ "Error": "Invalid filetype!" });
					return;
				}

				let fileinfo = req.file;
				if (req.body.videoname && req.body.tags && req.session.passport.user) {
					fileinfo.videoname = req.body.videoname;
					if (req.body.description) {
						fileinfo.description = req.body.description;
					} else {
						fileinfo.description = "No description";
					}
					fileinfo.adsCount = req.body.adsCount;
					fileinfo.tags = req.body.tags.split(',');
					fileinfo.userID = req.session.passport.user;
					const author = await authAPI.getUser({ _id: req.session.passport.user });
					fileinfo.channelName = author.nickname;
					fileinfo.views = 0;
				}
				else {
					reject("Video must have a name and tags")
					return;
				}


				const takeScreenshot = async (fileinfo) => {
					try {


						return new Promise((resolve, reject) => {
							const coverFileName = `${fileinfo.filename.slice(0, 32)}` + '.jpg';
							const coverDirPath = path.join(__dirname, '..', 'DATA', 'covers');
							let imgURL;
							Ffmpeg(fileinfo.path)
								.screenshots({
									timestamps: [0],
									filename: coverFileName,
									folder: coverDirPath,
									size: config.get('thumbsSize')
								})
								.on("end", (error, file) => {
									fileinfo.cover = fs.readFileSync(path.join(coverDirPath, coverFileName));
									s3.upload(
										{
											Bucket: config.get('AWS_BUCKET'),
											Key: 'COVERS/' + coverFileName,
											Body: fileinfo.cover,
											StorageClass: "REDUCED_REDUNDANCY",
											ACL: 'public-read'
										}, async (err, data) => {
											if (err) {
												throw err;
											}
											resolve(data.Location);
											fs.unlink(path.join(__dirname, '..', 'DATA', 'covers', coverFileName), (err) => {
												if (err) console.log("TMP File delete failed:", err)
											})
										}
									)

								})
						})
					} catch (e) {
						console.log("Error while taking screenshot", e);
					}

				}

				const calculateDuration = async (pathToVideo) => {
					try {


						await Ffmpeg.ffprobe(pathToVideo, (e, file) => {
							try {


								if (e || !file) {
									reject({ "Error": e });
								}
								fileinfo.duration = file.format.duration;
							} catch (e) {
								reject({ "Error": e });
							}
						})
					} catch (e) {
						console.log("Error while calculating duration", e);
					}
				}


				if (req.file.mimetype === "video/mp4") {

					await calculateDuration(fileinfo.path);


					await Ffmpeg(fileinfo.path, { timeout: 0 })
						.size('1920x1080').autopad('#000000')
						.keepDAR()
						.audioBitrate('128k')
						.videoCodec('libx264')
						.videoBitrate('1000k')
						.fps(30)
						.saveToFile(path.join(__dirname, '..', 'DATA', 'videos', fileinfo.filename))
						.on("end", async function (error, file) {

							fileinfo.path = path.join(__dirname, '..', 'DATA', 'videos', fileinfo.filename);

							fileinfo.file = fs.readFileSync(fileinfo.path)

							await s3.upload(
								{
									Bucket: config.get('AWS_BUCKET'),
									Key: 'VIDEOS/' + fileinfo.filename,
									Body: fileinfo.file,
									StorageClass: "REDUCED_REDUNDANCY",
									ACL: 'public-read'
								}, async (err, data) => {
									if (err) {
										throw err;
									}
									fileinfo.fileURL = data.Location;
									fileinfo.coverURL = await takeScreenshot(fileinfo);
									await torrentAPI.addVideo(fileinfo);
									resolve(200);

								})

						})
						.on("error", (e) => reject({ "Error": e }))
				} else {

					await calculateDuration(fileinfo.path);

					await Ffmpeg(fileinfo.path, { timeout: 0 })
						.withOutputFormat('mp4')
						.keepDAR()
						.size('1920x1080').autopad(true, '#000000')
						.audioBitrate('128k')
						.videoCodec('libx264')
						.videoBitrate('1000k')
						.fps(30)
						.saveToFile(path.join(__dirname, '..', 'DATA', 'videos', `${fileinfo.filename.slice(0, 32)}.mp4`))
						.on("end", async function (error, file) {

							await fs.unlink(fileinfo.path, (err) => {
								if (err) console.log("TMP File delete failed:", err)
							})
							fileinfo.filename = `${fileinfo.filename.slice(0, 32)}.mp4`;
							fileinfo.path = path.join(__dirname, '..', 'DATA', 'videos', fileinfo.filename);

							fileinfo.file = fs.readFileSync(fileinfo.path)
							await s3.upload(
								{
									Bucket: config.get('AWS_BUCKET'),
									Key: 'VIDEOS/' + fileinfo.filename,
									Body: fileinfo.file,
									StorageClass: "REDUCED_REDUNDANCY",
									ACL: 'public-read'
								}, async (err, data) => {
									if (err) {
										throw err;
									}
									fileinfo.fileURL = data.Location;
									fileinfo.coverURL = await takeScreenshot(fileinfo);
									await torrentAPI.addVideo(fileinfo);
									resolve(200);

								})

						})

						.on("error", (e) => reject({ "Error": e }))


				}

			} catch (e) {
				reject({ "Error": e });
			}
		})

	}

	await upload(req)
		.then(resStatus => res.status(resStatus).send("DOWNLOADED!"))
		.catch(e => {
			res.status(501).send(e);
		})






})


module.exports = router;
