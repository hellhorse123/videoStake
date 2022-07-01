const express = require('express');
var cors = require('cors')
const config = require('config');
const fs = require('fs');
const path = require('path');

const auth = require('./utils/authAPI');
const videos = require('./utils/videosAPI');
const comments = require('./utils/commentsAPI');
const blockchain = require('./utils/blockchainAPI');
//const cronos = require('./utils/cronos');

const contentRouter = require('./routes/content.route');
const userAuthRouter = require('./routes/user.auth.route');
const userInfoRouter = require('./routes/user.info.route');

const commentsRouter = require('./routes/comments.route');
const blockchainRouter = require('./routes/blockchain.route');


const PORT = process.env.PORT || config.get('port') || 8080;
const app = express();



app.use(contentRouter);
app.use(userAuthRouter);
app.use(userInfoRouter);
app.use(commentsRouter);
app.use(blockchainRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

const whitelist = ['http://localhost:3000', 'http://localhost:8080']
const corsOptions = {
    origin: function (origin, callback) {
        console.log("** Origin of request " + origin)
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            console.log("Origin acceptable")
            callback(null, true)
        } else {
            console.log("Origin rejected")
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions))

async function start(){
    try{

            fs.mkdirSync(path.join(__dirname, 'DATA', 'videos'),{recursive: true});
            fs.mkdirSync(path.join(__dirname, 'DATA', 'torrents'),{recursive: true});
            fs.mkdirSync(path.join(__dirname, 'DATA', 'covers'),{recursive: true});
            fs.mkdirSync(path.join(__dirname, 'DATA', 'tmp'),{recursive: true});

        await auth.connectDB(config.get('dbURL'));
        await videos.connectDB(config.get('dbURL'));
        await comments.connectDB(config.get('dbURL'));
        await blockchain.connectDB(config.get('dbURL'));

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        })

    }
    catch (err){
        console.log('Error', err);
        process.exit(1);
    }
}


start();

