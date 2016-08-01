var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');

var app = express();

var db_name = 'AaWPLImcIQRcrDyjTfVx'; //数据库名称
var db_host = 'mongo.duapp.com'; //数据库地址
var db_port = '8908'; // 数据库端口
var username = 'c690f487e80941de9c917f59724e6051'; //用户AK
var password = '7caba0a798da489b93853c597235b20c'; //用户SK

//创建数据库连接
mongoose.connect('mongodb://'+username+':'+password+'@'+db_host+':'+db_port+'/'+db_name);
var db = mongoose.connection;
db.on('error',function(){
  console.log('connect error');
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
var server = app.listen(18080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(' app listening at http://%s:%s', host, port);
});

module.exports = app;
