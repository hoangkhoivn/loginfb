var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;


var app = express();

app.use(session({
  secret: '18534126a6bc2dd06d41bfe4065703e1',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Cấu hình passport
app.use(passport.initialize());
app.use(passport.session());

// Cấu hình Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: "978152080297431",
  clientSecret: "18534126a6bc2dd06d41bfe4065703e1",
  callbackURL: 'https://hoangkhoilogin.onrender.com/auth/google/callback',
  profileFields: ['id', 'displayName', 'photos', 'email']
},
function(accessToken, refreshToken, profile, done) {
  // Xử lý thông tin người dùng
  // accessToken là mã truy cập của Facebook API
  // profile là thông tin người dùng từ Facebook
  return done(null, profile);
}));

// Lưu thông tin người dùng vào session
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Lấy thông tin người dùng từ session
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Đăng nhập bằng Facebook
app.get('/', passport.authenticate('facebook'));

// Xử lý callback từ Facebook
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

// Hiển thị trang profile
app.get('/profile', function(req, res) {
  res.send('Welcome ' + req.user.displayName + '!');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
