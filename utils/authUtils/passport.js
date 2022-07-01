const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//Load User Model
const User = require('../../models/users');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'login' }, (login, password, done) => {

            User.findOne({$or:[{email: login},{nickname: login}]})
                .then(user => {
                    if(!user) {
                        return done(null, false, { message: 'Incorrect data'});
                    }
                    //Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if(isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: 'Incorrect data' })
                        }
                    });
                })
                .catch(err => console.log(err))
        })
    );

    passport.serializeUser((user, done) =>  {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(null, user);
        });
    });
}; 