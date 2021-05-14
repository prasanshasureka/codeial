const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use google strategy
passport.use(new googleStrategy({
    clientID: "662221919973-ng4hgf3lmh6cik5rtvo3r23jnu61rsn7.apps.googleusercontent.com",
    clientSecret: "cdTqMg6GLBgtEvQ2qIWQW-FE",
    callbackURL: "http://localhost:8000/user/auth/google/callback"
    }, 
    function(accessToken, refreshToken, profile, done){
        // find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if (err){console.log("Error in google strategy passport",err); return;}
            console.log(profile);

            if (user){
                // if found, set this user as req.user
                return done(null, user);
            } else {
                // if not found, create the user and set it as req.user
                // set it as req.user means sign in that user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if (err){console.log("Error in creating user",err); return;}
                    
                    return done(null, user);
                });
            }

        });
    }
));


module.exports = passport
