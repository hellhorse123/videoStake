const passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
const config = require('config');
const authAPI = require('../authAPI');

passport.use(new FacebookStrategy({
    clientID: config.get("facebookClientID"),
    clientSecret: config.get("facebookSecret"),
    callbackURL: "https://videosteak.herokuapp.com/api/auth/facebook/callback",
    scope: ['email'],
    profileFields: ['accounts', 'email', 'name','displayName']
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

    let userData = await authAPI.getUser({"nickname": profile.name.givenName});
    if(!userData) {
        await creatUserFromSocialData(getSocialProfileData(profile));
        userData = await authAPI.getUser({"nickname": profile.name.givenName});
    }
    profile.id = profile._id = userData._id;

    return done(null, profile);
  }
));