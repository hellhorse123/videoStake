var passport = require('passport');
const config = require('config');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const authAPI = require('../authAPI');
const User = require('../../models/users');

passport.serializeUser((user, done) =>  {
    done(null, user.id);
  });

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: config.get("googleClientID"),
    clientSecret: config.get("googleSecret"),
    callbackURL: "https://videosteak.herokuapp.com/auth/google/callback",
    scope: ['email', 'profile']
  },
  async function(accessToken, refreshToken, profile, done) {

    creatUserFromSocialData = async (userData) => {
      if(userData.firstname && userData.lastname && userData.nickname && userData.dateOfBirth && userData.email && userData.password) {
          try {
              return authAPI.saveUser(userData);
          }catch(e){
                  console.log(e);
          }
      }
    
    }

    getSocialProfileData = function(profile) {

      let userData;
      userData = {
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          nickname: profile.name.givenName,
          dateOfBirth: "unknown",
          email: profile._json.email,
          password: authAPI.getAlphaNumericRandom(8)
      }
    
      return userData;
    }

    let userData = await authAPI.getUser({"nickname": profile._json.given_name});
    if(!userData) {
        await creatUserFromSocialData(getSocialProfileData(profile));
        userData = await authAPI.getUser({"nickname": profile._json.given_name});
    }
    profile.id = profile._id = userData._id;

    return done(null, profile);
  }
)); 