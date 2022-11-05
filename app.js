var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const bcrypt =require('bcryptjs');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// router import
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var commentsRouter = require('./routes/comments');
var postsRouter =  require('./routes/posts');

var app = express();
app.use(cors());

//integrate MONGO DB
const mongoose = require("mongoose");
const mongoDB = 'mongodb+srv://kurniadikevin:pisausl@cluster0.vqkgg6n.mongodb.net/?retryWrites=true&w=majority'
/* const mongoDB = process.env.MONGODB_URI || dev_db_url; */
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//passport local strategy method
passport.use(
  new LocalStrategy((email, password, done) => {
    User.findOne({ email: username }, (err, user) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        }
         else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      })
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//user authentication and sign up
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


//assign current user
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// router use
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
//app.use('/comments', commentRouter);



//LOGIN on app
app.post(
  "/users/login",
  passport.authenticate("local", {
    /* successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/login",  */
    passReqToCallback: true
  }), (req, res)=>{
    // If you use "Content-Type": "application/json"
    // req.isAuthenticated is true if authentication was success else it is false
    res.json({auth: req.isAuthenticated()});
    //res.send('login sucessful')
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

module.exports = app;
