var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var configAuth = require("../config/auth");

var User = require("../models/user");

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        })
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            process.nextTick(function () {
                User.findOne({ 'local.email': email }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.username = req.body.username;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            else done(null, newUser);
                        })
                    }
                })
            })
        }
    ));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            User.findOne({ 'local.email': email }, function (err, user) {
                console.log(user)
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                if (!user.validPassword(password)){
                    return done(null, false, req.flash('loginMessage', 'Wrong password.'));
                }
                else{
                    return done(null, user);
                }
                
            })
        }
    ));

    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID ,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL, 
    },
    function(token,refreshToken, profile, done){
        process.nextTick(function(){
            User.findOne({'google.id': profile.id}, function (err, user) {
                if(err){
                    return done(err);
                }
                if(user){
                    return done(null, user);
                }
                else {
                    var newUser = new User();

                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                    newUser.local.username = profile.displayName;

                    newUser.save(function (err) {
                        if(err){
                            throw err;
                        }
                        return done(null, newUser);
                    })
                }
            })
        })
    }
    ));
}