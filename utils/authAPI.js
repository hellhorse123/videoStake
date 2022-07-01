const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../models/users');
const bcrypt = require('bcryptjs');

exports.getAlphaNumericRandom = function(len) {
    if ((len==undefined) || (len<=0)) {len=1;}
    var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    var iffirst = 0;
    for(var i=0;i<len;i++){
      if (i==0) {iffirst = 10;} else {iffirst = 0;}
      result += characters[Math.round(Math.random()*(characters.length-iffirst-1))];
    }
    return result;
  }

exports.connectDB = async function (dbURL){

    await mongoose.connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
}



exports.saveUser = async (userData) => {
    const user = {
        _id: userData._id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        nickname: userData.nickname,
        dateOfBirth: userData.dateOfBirth,
        email: userData.email,
        password: await hash(userData.password)
    }
    return new User(user).save()
}

exports.updateUser = async (userData) => {
    return await User.updateOne({_id: userData._id}, userData, {new: true});
}

exports.getUser = function(filter) {
    return User.findOne(filter).lean();
}

exports.checkUser = function(userData) {
    return User
        .findOne({nickname: userData.nickname})
        .then(function(doc){
            if ( doc.password === hash(userData.password) ){
                return Promise.resolve(doc)
            } else {
                return Promise.reject("Error wrong")
            }
        })
}


function hash(text) {
    return bcrypt.hash(text, 10);
}