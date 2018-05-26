var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var openid = require('passport-openid');
var strategy = require('passport-openid').Strategy;

var indexRouter = require('./routes/index');
var appsRouter = require('./routes/apps');
var wfRouter = require('./routes/workflow');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

app.use('/', indexRouter);
app.use('/apps', appsRouter);
app.use('/workflow', wfRouter);

//Auth
app.post('/auth/openid',
  passport.authenticate('openid'));

app.get('/auth/openid/return', 
  passport.authenticate('openid', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// catch 404 and forward to error handler
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


// Auth functions
passport.use(new OpenIDStrategy({
  returnURL: 'http://localhost:3000/auth/openid/return',
  realm: 'http://localhost:3000/'
},
function(identifier, done) {
  User.findByOpenID({ openId: identifier }, function (err, user) {
    return done(err, user);
  });
}
));

strategy.saveAssociation(function(handle, provider, algorithm, secret, expiresIn, done) {
  // custom storage implementation
  saveAssoc(handle, provider, algorithm, secret, expiresIn, function(err) {
    if (err) { return done(err) }
    return done();
  });
});

strategy.loadAssociation(function(handle, done) {
  // custom retrieval implementation
  loadAssoc(handle, function(err, provider, algorithm, secret) {
    if (err) { return done(err) }
    return done(null, provider, algorithm, secret)
  });
});


module.exports = app;
