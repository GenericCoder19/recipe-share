var express = require('express');
var router = express.Router();
var middleware = require("../middleware");
var passport = require('passport');
require('../config/passport')(passport);

router.get('/', function(req, res) {
  res.render('users/index.ejs', {title: "User Login and Signup"});
});

router.get('/login', function(req, res) {
  res.render('users/login.ejs', {title: "User Login and Signup" ,message: req.flash('loginMessage') }); 
});

router.post('/login',passport.authenticate('local-login',{
  successRedirect : '/',
  failureRedirect : '/users/login',
  failureFlash : true
}));

router.get('/signup', function(req, res) {
  res.render('users/signup.ejs', {title: "User Login and Signup", message: req.flash('signupMessage') });
});

router.post('/signup', passport.authenticate('local-signup',{
  successRedirect : '/recipes',
  failureRedirect : '/users/signup',
  failureFlash : true
}));

router.get('/profile', middleware.isLoggedIn, function(req, res) {
  res.render('users/profile.ejs', {
      user : req.user,
      title: "User Login and Signup"
  });
});

router.get('/auth/google', passport.authenticate('google',{scope: ['profile', 'email']}));

router.get('/auth/google/callback', passport.authenticate('google',{
  successRedirect: '/',
  failureRedirect: '/users'
}))

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
