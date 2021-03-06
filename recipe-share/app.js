var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var passport = require('passport');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var recipesRouter = require('./routes/recipes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(session({ secret: '!4a3$te(xn1nkgy%n3n$6eqqra^xur435mea!=eigb%9p62e&w', resave: true, saveUninitialized: true })); // ONLY TEMPORARY TO CHANGE
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method"));

//ROUTERS
app.use('/', indexRouter);
app.use('/recipes', recipesRouter);
app.use('/users', usersRouter);

//Connect to DB
let url = "mongodb://localhost:27017/recipes_v1";
mongoose.connect(url, { useNewUrlParser: true });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//Pass User to all pages
app.use((req, res, next) => {
  app.locals.currentUser = req.user; // req.user is an authenticated user
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
