const { Router, json } = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('config');
const fs = require('fs');
const { ensureAuthenticated } = require('../utils/authUtils/auth');
const videosAPI = require('../utils/videosAPI');
const authAPI = require("../utils/authAPI")
const passport = require('passport');
const blockchainAPI = require('../utils/blockchainAPI');
const queue = require('queue');

const blocksQueue = queue({ results: [] }, queue.autostart);


const router = Router();

router.use(json())

router.use(session({
    secret: 'LolIDK',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        url: config.get('dbURL')
    })
}))

router.use(passport.session());

router.post('/api/chain/block', ensureAuthenticated, async (req, res) => {
    try {

        let data = {
            seenPercent: req.body.seenPercent,
            videoId: req.body.videoId
        };

        data.userId = req.session.passport.user;

        blocksQueue.push(await blockchainAPI.addNewBlock(data));

        if(await blockchainAPI.isCommercial(data)) {

            const video = await videosAPI.getVideo(req.body.videoId);
            const user = await authAPI.getUser({_id: data.userId});

            const now = new Date(Date.now());
            const videoViewsPerPeriodObj = video.commercialViewsPerPeriod.find(
                period => {
                    return period.month === now.getMonth() && period.year === now.getFullYear()
                }
            )

            const userViewsPerPeriodObj = user.commercialViewsPerPeriod.find(
                period => {
                    return period.month === now.getMonth() && period.year === now.getFullYear()
                }
            )

            if (
                video.commercialViewsPerPeriod &&
                video.commercialViewsPerPeriod.length!==0 &&
                videoViewsPerPeriodObj &&
                !videoViewsPerPeriodObj.userIds.includes(req.session.passport.user)
            )
            {
                videoViewsPerPeriodObj.userIds.push(data.userId);
            } else if (!videoViewsPerPeriodObj || !videoViewsPerPeriodObj.userIds.includes(req.session.passport.user)) {
                video.commercialViewsPerPeriod.push({
                    month: now.getMonth(),
                    year: now.getFullYear(),
                    userIds: [data.userId]
                });
            }

            if (
                user.commercialViewsPerPeriod &&
                user.commercialViewsPerPeriod.length!==0 &&
                userViewsPerPeriodObj &&
                !userViewsPerPeriodObj.videoIds.includes(req.body.videoId)
            )
            {
                userViewsPerPeriodObj.videoIds.push(req.body.videoId);
            } else if (!userViewsPerPeriodObj || !userViewsPerPeriodObj.videoIds.includes(req.body.videoId)) {
                user.commercialViewsPerPeriod.push({
                    month: now.getMonth(),
                    year: now.getFullYear(),
                    videoIds: [req.body.videoId]
                });
            }

            await videosAPI.updateVideo(video);
            await authAPI.updateUser(user);
        }

        res.status(200).send("Added!");

    }catch (e){
        res.status(500).send(e);
    }
})

router.get('/api/chain/isvalid', async (req, res) => {
    try {
        const valid = blockchainAPI.checkChainValidity();
        valid.then(stat => res.status(200).send(stat));
    }catch (e){
        res.status(500).send(e);
    }

})

router.get('/api/chain', async (req, res) => {
    try {
        res.send(await JSON.stringify(await blockchainAPI.getBlock({})));
    }catch (e){
        res.status(501).send(e);
    }

})



module.exports = router;
