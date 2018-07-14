var express = require('express');
var router = express.Router();
var middleware = require("../middleware");

router.get('/', function(req, res) {
  res.render('users/index.ejs', {title: "User Login and Signup"}); // load the index.ejs file
});

router.get('/login', function(req, res) {
  res.render('users/login.ejs', {title: "User Login and Signup" ,message: req.flash('loginMessage') }); 
});

router.get('/signup', function(req, res) {
  res.render('users/signup.ejs', {title: "User Login and Signup", message: req.flash('signupMessage') });
});

router.get('/profile', middleware.isLoggedIn, function(req, res) {
  res.render('users/profile.ejs', {
      user : req.user,
      title: "User Login and Signup"
  });
});

router.get('/users/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
