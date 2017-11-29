var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var authentication = require('./auth')



// connect to server

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var config =require('./config')

var url = config.mongoUrl
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});



var index = require('./routes/index');
var users = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leadRouter= require('./routes/leaderRouter');
var promoRouter= require('./routes/promoRouter');
var favRouter= require('./routes/favRouter');


var app = express();

//redirect traffic if http is used instead of https
app.all('*', function(req, res, next){
  if(req.secure){
    return next()
  };
  res.redirect('https://'+ req.hostname+':'+ app.get('secPort')+ req.url)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// passport config


app.use(passport.initialize());


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
 app.use('/dishes', dishRouter);

 app.use('/leadership', leadRouter);

 app.use('/promotions', promoRouter);
 app.use('/favorites', favRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;