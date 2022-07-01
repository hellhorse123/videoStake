const VKontakteStrategy = require('passport-vkontakte').Strategy;
const config = require('config');
const passport = require('passport');
const authAPI = require('../authAPI');
// User session support middlewares. Your exact suite might vary depending on your app's needs.



passport.use(new VKontakteStrategy(
  {
    clientID:     config.get("vkClientID"), // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: config.get("vkSecret"),
    callbackURL:  "https://videosteak.herokuapp.com/api/auth/vkontakte/callback",
    scope: ['email', 'bdate'],
    profileFields: ['email', 'city', 'bdate']
  },
  async function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {


    getSocialProfileData = function(profile) {

      let userData;
      userData = {
          firstname: profile._json.first_name,
          lastname: profile._json.last_name,
          nickname: profile.username,
          dateOfBirth: profile._json.bdate,
          email: profile._json.email||profile.emails[0].value,
          password: authAPI.getAlphaNumericRandom(8)
      }
    
      return userData;
    }
    
    creatUserFromSocialData = async (userData) => {
      if(userData.firstname && userData.lastname && userData.nickname && userData.dateOfBirth && userData.email && userData.password) {
          try {
              return authAPI.saveUser(userData);
          }catch(e){
                  console.log(e);
          }
      }
    
    }

        let userData = await authAPI.getUser({"nickname": profile.username});
        if(!userData) {
            await creatUserFromSocialData(getSocialProfileData(profile));
            userData = await authAPI.getUser({"nickname": profile.username});
        }
        profile.id = profile._id = userData._id;

      return done(null, profile);
  }
));

// User session support for our hypothetical `user` objects.
passport.serializeUser(function(user, done) {

    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id)
        .then(function (user) { done(null, user); })
        .catch(done);
      }); 