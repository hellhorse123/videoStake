const { Router, json, urlencoded } = require('express');
const { ensureAuthenticated } = require('../utils/authUtils/auth');
const authAPI = require('../utils/authAPI')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const config = require('config');
const passport = require('passport');
const videosAPI = require('../utils/videosAPI');


const router = Router();

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
router.use(json())




router.post('/api/user/history', ensureAuthenticated, async (req, res) => {
    try {
        let user = await authAPI.getUser({_id: req.session.passport.user});
        if(await videosAPI.isVideoExists(req.body.videoID) && user) {

            user.historyVideoIds = user.historyVideoIds.filter(id => id !== req.body.videoID);
            user.historyVideoIds.push(req.body.videoID);
            await authAPI.updateUser(user);
            res.status(200).send("Added!");

        }else{
            res.status(404).send("There is no such video!");
        }
    }catch (e){
        res.status(500).send("Internal error");
    }
})

router.get('/api/user/my/history', ensureAuthenticated, async (req, res) => {
    try{
        let videos = [];

        const user = await authAPI.getUser({_id: req.session.passport.user});
        if(user) {
            await user.historyVideoIds.map((videoId) => {
                videos.push(videosAPI.getVideo(videoId));
            });
            Promise.all(videos).then((videos) => {
                videos = videos.filter(element => element !== null)
                res.status(200).send(videos.reverse());
            })
        }else throw "No such user";
    }catch (e){
        res.status(500).send("Error");
    }
})

router.post('/api/user/favorites', ensureAuthenticated, async (req, res) => {
    try {
        if(await videosAPI.isVideoExists(req.body.videoID)) {

            let user = await authAPI.getUser({_id: req.session.passport.user});
            if (!user.favoritesIds.includes(req.body.videoID)) {
                user.favoritesIds.push(req.body.videoID);
            } else {
                user.favoritesIds = user.favoritesIds.filter(item => item !== req.body.videoID);
            }

            await authAPI.updateUser(user);
            res.status(200);
        }else{
            res.status(404).send("There is no such video!");
        }
    }catch (e) {
        res.status(500).send("Internal error");
    }
})


router.get('/api/user/my/favorites', ensureAuthenticated, async (req, res) => {
    try{
        let videos = [];

        const user = await authAPI.getUser({_id: req.session.passport.user});
        await user.favoritesIds.map((videoId) => {
            videos.push(videosAPI.getVideo(videoId));
        });
        Promise.all(videos).then((videos) => {
            videos = videos.filter(element => element !== null)
            res.status(200).send(videos.reverse());
        })

    }catch (e){
        res.status(500).send("Error");
    }
})

router.post('/api/user/subscribes', ensureAuthenticated, async (req, res) => {

    try {

        if (req.session && req.session.passport && req.session.passport.user && req.body && req.body.channelID) {

            let user = await authAPI.getUser({_id: req.session.passport.user});
            let author = await authAPI.getUser({_id: req.body.channelID});

            if (!user.subscribes.includes(req.body.channelID)) {
                user.subscribes.push(req.body.channelID);
                author.subscribers.push(req.session.passport.user);
            } else {
                user.subscribes = user.subscribes.filter(item => item !== req.body.channelID);
                author.subscribers = author.subscribers.filter(item => item !== req.session.passport.user);
            }

            await authAPI.updateUser(user);
            await authAPI.updateUser(author);
            res.status(200);
        }else{
            throw "Invalid data";
        }
    }catch (e) {
        res.status(500).send("Internal error");
    }
})

router.get('/api/user/my/subscribes', ensureAuthenticated, async (req, res) => {
    try{
        let channelsVideos = [];
        let videos = [];

        const user = await authAPI.getUser({_id: req.session.passport.user});
        await user.subscribes.map((authorId) => {
            const authorVideos = videosAPI.videoList({creatorID: authorId})
            channelsVideos.push(authorVideos);
        });



        await Promise.all(channelsVideos).then((channelVideos) => {
            channelVideos = channelVideos.filter(element => element !== null)
            channelVideos.map((authorVideos) => {
                videos = videos.concat(authorVideos);
            })
        })

        Promise.all(videos).then(videos => {
            videos.sort((a, b) => {
                return (a.creationDate > b.creationDate)? 1 : -1;
            });

            res.status(200).send(videos.reverse());
        })


    }catch (e){
        res.status(500).send("Error");
    }
})

router.get('/api/user/my/earn', ensureAuthenticated, async (req, res) => {
    try{

        const commercialViewPrice = config.get("VIEW_COST") || 0;

        const viewerEarnRatio = config.get("VIEWER_EARN_RATIO") || 0.3;
        const creatorEarnRatio = config.get("CREATOR_EARN_RATIO") || 0.5;

        let earnedPerPeriodFromMyViews = 0;
        let earnedTotalFromMyViews = 0;

        let earnedPerPeriodFromMyVideos = 0;
        let earnedTotalFromMyVideos = 0;

        let earnedTotalPerPeriod = 0;
        let earnedTotal = 0;


        const user = await authAPI.getUser({_id: req.session.passport.user});
        const now = new Date(Date.now());

        if(user.commercialViewsPerPeriod) {

            const userViewsPerPeriodObj = user.commercialViewsPerPeriod.find(
                period => {
                    return period.month === now.getMonth() && period.year === now.getFullYear()
                }
            )

            if (!userViewsPerPeriodObj) {
                earnedPerPeriodFromMyViews = 0;
            } else {
                earnedPerPeriodFromMyViews = userViewsPerPeriodObj.videoIds.length * commercialViewPrice * viewerEarnRatio;
            }

            if (user.commercialViewsPerPeriod) {
                earnedTotalFromMyViews = await user.commercialViewsPerPeriod.reduce((acc, currentPeriod) => {
                    return acc + currentPeriod.videoIds.length * commercialViewPrice * viewerEarnRatio;
                }, 0);
            }
        }else{
            earnedTotalFromMyViews = 0;
            earnedPerPeriodFromMyViews = 0;
        }

        const myVideos = await videosAPI.videoList({creatorID: req.session.passport.user});

        if(myVideos && myVideos.length!==0) {
            await myVideos.map(async (currentVideo) => {
                if(currentVideo.commercialViewsPerPeriod && currentVideo.commercialViewsPerPeriod.length!==0) {
                    const videoViewsPerPeriodObj = await currentVideo.commercialViewsPerPeriod.find(
                        period => {
                            return period.month === now.getMonth() && period.year === now.getFullYear()
                        }
                    )

                    if (videoViewsPerPeriodObj && videoViewsPerPeriodObj.userIds && videoViewsPerPeriodObj.userIds.length !== 0) {
                        earnedPerPeriodFromMyVideos += videoViewsPerPeriodObj.userIds.length * commercialViewPrice * creatorEarnRatio;
                    }

                    if (currentVideo.commercialViewsPerPeriod && currentVideo.commercialViewsPerPeriod.length !== 0) {
                        await currentVideo.commercialViewsPerPeriod.map((currentPeriod) => {
                            if (currentPeriod && currentPeriod.userIds && currentPeriod.userIds.length !== 0) {
                                earnedTotalFromMyVideos += videoViewsPerPeriodObj.userIds.length * commercialViewPrice * creatorEarnRatio;
                            }
                        })
                    }
                }
            })
        }

        earnedTotalPerPeriod = earnedPerPeriodFromMyVideos + earnedPerPeriodFromMyViews;
        earnedTotal = earnedTotalFromMyVideos + earnedTotalFromMyViews;
        res.status(200).send({
            earnedPerPeriodFromMyVideos: earnedPerPeriodFromMyVideos,
            earnedTotalFromMyViews: earnedTotalFromMyViews,
            earnedTotalFromMyVideos: earnedTotalFromMyVideos,
            earnedPerPeriodFromMyViews: earnedPerPeriodFromMyViews,
            earnedTotalPerPeriod: earnedTotalPerPeriod,
            earnedTotal: earnedTotal
        });

    }catch (e){
        console.log(e);
        res.status(500).send({error: e});
    }
})

router.get('/api/user/:userId', async (req, res) => {
    try{
        let user = {}
        if(req.params.userId.length === 12){
            user = await authAPI.getUser({_id: req.params.userId});
        }else{
            if(req.params.userId.length === 24){
                user = await authAPI.getUser({_id: req.params.userId});
            }else{
                user = await authAPI.getUser({nickname: req.params.userId});
            }
        }
        res.status(200).send(user);
    }catch (e){
        console.log(e)
        res.status(500).send(e);
    }
})


module.exports = router;
