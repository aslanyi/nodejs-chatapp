const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
dotenv.config();

//routers


const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const chatRouter = require('./routes/chat');
const messageRouter = require('./routes/message');

const app = express();
//helpers
const db = require('./helpers/db')();
const redisStore = require('./helpers/redisStore');
// middlewares
const isAuthenticated = require('./middlewares/isAuthenticated');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// bower folder
app.use(express.static('bower_components'));

//session
app.use(session({
  store:redisStore,
  secret: process.env.SESSION_SECRET_ID,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false , maxAge: 14 * 24 * 3600000}
}));

// passport.js
app.use(passport.initialize());
app.use(passport.session());
//routes
app.use('/', indexRouter);
app.use('/auth',authRouter);
app.use('/chat',isAuthenticated,chatRouter);
app.use('/message',messageRouter);
// catch 404 and forward to error handler
app.use((req, res, next)=> {
  next(createError(404));
});

// error handler
app.use((err, req, res, next)=> {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
