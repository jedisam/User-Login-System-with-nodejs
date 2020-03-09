const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var session = require('express-session');
const passport = require('passport');
const expressValidator = require('express-validator')
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const upload = multer({dest:'./uploads'})
const flash = require('connect-flash');
const bcrypt = require('bcryptjs')
const mongo = require('mongodb');
const mongoose = require('mongoose');


const db = mongoose.connection


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// // HAndle File Uploads
// app.use(multer({dest:'./uploads'}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// // Express sessions

app.use(session({
  secret:'secret',
  saveUnitialized:true,
  resave:true
}))

//passport
app.use(passport.initialize())
app.use(passport.session())

//Validator

app.use(expressValidator({
  errorFormatter:function(param,msg,value){
    var namespace=param.split('.'),
    root=namespace.shift(),
    formParam=root

    while(namespace.length){
      formParam+='['+namespace.shift()+']'
    }
    return{
      param:formParam,
      msg:msg,
      value:value
    }
  }
}))
// Express-Messages
app.use(require('connect-flash')());
app.use((req,res,next)=>{
  res.locals.messages=require('express-messages')(req,res);
  next();
})

app.get('*',(req,res,next)=>{
  res.locals.user = req.user||null
  next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
  console.log("Server started on PORT ",PORT)
})

module.exports = app;
