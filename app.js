var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose")
const passport = require("passport")
const cors = require("cors")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postsRouter = require("./routes/posts")
const commentsRouter = require("./routes/comments")
const authRouter = require("./routes/auth")
const notificationsRouter = require("./routes/notifications")
require("dotenv").config()
var app = express();

mongoose.connect(process.env.MONGO_DB,  { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

require('./config/passport')(passport);
app.use(passport.initialize())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())


app.use('/', indexRouter);
app.use("/auth", authRouter)
app.use('/users', usersRouter);
app.use("/posts", postsRouter)
app.use("/comments", commentsRouter)
app.use("/notifications", notificationsRouter)
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
  res.json({msg: 'error'});
});

module.exports = app;
