const { Router, json } = require('express');
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const config = require('config');
const fs = require('fs')
const { ensureAuthenticated } = require('../utils/authUtils/auth');
const videosAPI = require('../utils/videosAPI');
const passport = require('passport');
const commentsAPI = require('../utils/commentsAPI')
const authAPI = require('../utils/authAPI');



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

router.post('/api/comments/:videoID', ensureAuthenticated, async (req, res)=> {
    try {
        const video = await videosAPI.getVideo(req.params.videoID);
        const user = await authAPI.getUser({_id: req.session.passport.user});


        const comment = {
            videoID: req.params.videoID,
            commentatorID: req.session.passport.user,
            commentatorNickname: user.nickname,
            data: req.body.data
        }


        commentsAPI.addComment(comment)

    }catch (e){
        console.log("Asked video", req.params.videoID, "but it isn't found!")
        res.status(404).send("There is no such video!");
        return;
    }
})

router.get('/api/comments/:videoID', async (req, res)=> {
    try {
        const comments = await commentsAPI.getComments({videoID: req.params.videoID});
        res.send(comments.reverse());
    }catch (e){
        console.log("Asked comments for video", req.params.videoID, "but it isn't found!")
        res.status(404).send("There is no such video!");
    }

})
module.exports = router;
