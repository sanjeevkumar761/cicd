var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerUi = require('swagger-ui-express');

// routers
var indexRouter = require('./routes/index');
var appsRouter = require('./routes/apps');
var wfRouter = require('./routes/workflow');

//swagger setup
var swaggerDocument = require('./api/swagger.json'); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));
app.use(function(req, res, next) {
  res.setHeader( 'Access-Control-Allow-Origin', '*');
  next();
});

// API Routes
app.use('/', indexRouter);
app.use('/apps', appsRouter);
app.use('/workflow', wfRouter);

// Add swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 
app.use('/api/v1', indexRouter); 

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


module.exports = app;
