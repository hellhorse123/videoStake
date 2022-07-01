const mongoose = require('mongoose');

const SHA256 = require("crypto-js/sha256");
const chainBlock = require('../models/chainBlocks');

const authAPI = require('./authAPI');
const videoAPI = require('./videosAPI')

class Block {
     constructor(index, timestamp, userId, videoId, seenPercent, precedingHash = " ") {
         return new Promise(async (resolve, reject) => {
             if(index === 0){
                 this.index = 0;
                 this.timestamp = 0;
                 this.userId = 0;
                 this.videoId = 0;
                 this.seenPercent = 0;
                 this.isCommercial = false;
                 this.precedingHash = "INITIAL";
                 this.hash = this.computeHash();

                 resolve(this);
                 return;
             }

             this.index = index;
             this.timestamp = timestamp;
             this.userId = userId;
             this.videoId = videoId;
             this.seenPercent = seenPercent;

             this.isCommercial = await this.checkConditions();
             this.precedingHash = precedingHash;
             this.hash = this.computeHash();
             resolve(this);
         })


    }

    async checkConditions() {
        const user = await authAPI.getUser({_id: this.userId});
        const video = await videoAPI.getVideo(this.videoId);

        this.isSubscribed = user.subscribes.includes(video.creatorID);
        this.isLiked = video.likedBy.includes(this.userId);

        return (this.isLiked && this.isSubscribed && (this.seenPercent >= 0.7));
    }

    computeHash() {
        return SHA256(
            this.index +
            this.precedingHash +
            this.timestamp +
            JSON.stringify(this.data)
        ).toString();
    }

}

exports.connectDB = async (dbURL) => {
    await mongoose.connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
}

exports.isCommercial = async (data) => {
    const user = await authAPI.getUser({_id: data.userId});
    const video = await videoAPI.getVideo(data.videoId);

    const isSubscribed = user.subscribes.includes(video.creatorID);
    const isLiked = video.likedBy.includes(data.userId);

    return (isLiked && isSubscribed && (data.seenPercent >= 0.7));
}

exports.checkChainValidity = async () => {

    const blockchain = await chainBlock.find();

    return await blockchain.reduce( (acc, currentBlock) => {
        if(acc === false){
            return false;
        }
        if(currentBlock.index === 0){
            return true;
        }
        const previousBlock = blockchain.find( (block) => {return block.index === (currentBlock.index-1)} );
        return currentBlock.precedingHash === previousBlock.hash;
    }, true)

}

exports.addNewBlock = async (data) => {
    const initBlock = await chainBlock.find({index: 0});


    if(initBlock.length === 0){
        console.log("Creating initial block...")
        await startGenesisBlock();
    }

    const latestBlock = await obtainLatestBlock()



    const newBlock = await new Block(latestBlock.index+1, Date.now(), data.userId, data.videoId, data.seenPercent, latestBlock.hash);
    return new chainBlock(await newBlock).save();
}

exports.checkConditions = async (data) => {
    const user = await authAPI.getUser({_id: data.userId});
    const video = await videoAPI.getVideo(data.videoId);

    isSubscribed = user.subscribes.includes(video.creatorID);
    isLiked = video.likedBy.includes(data.userId);

    return (isLiked && isSubscribed && (data.seenPercent >= 0.7));
}

exports.getBlock = async (filter) => {
    return chainBlock.find(filter);
}

obtainLatestBlock = async () => {
    return chainBlock.findOne({}, {}, { sort: { 'index' : -1 } });
}

startGenesisBlock = async () => {
    return new chainBlock( await new Block(0, Date.now(), 0, 0, 0, "0")).save()
}
