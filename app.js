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

const multer = require('multer');
var fs = require('fs');

//import model
const User = require('./models/users');
const imgModel = require('./models/images');


// router import
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter =  require('./routes/posts');
//var imagesRouter = require('./routes/images');
//var commentsRouter = require('./routes/comments');



var app = express();
app.use(cors({
  origin: "http://localhost:3000", // <-- location of the react app were connecting to
  credentials: true,
}));

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
  new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
  },
    (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) throw err;
      if (!user) return done(null, false);
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
  User.findById({_id: id}, function(err, user) {
    done(err, user);
  });
});

//user authentication and sign up
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
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
//app.use('/images', imagesRouter);
//app.use('/comments', commentRouter);


/* <-----------LOGIN USER SECTION ----------------------------------> */
app.get('/users/login',(req,res)=>{
  res.json('login get loaded')
})

app.post("/users/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send(req.user);
      });
    }
  })(req, res, next);
});

app.get('/currentUser',(req,res,next)=>{
  res.send(req.user)
 
})

/* <-----------multer for image management-----------------> */
  var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });

//get all images in upload
app.get('/images', (req, res) => {
  imgModel.find({}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('imagesPage', { items: items });
      }
  });
});

// post images upload
app.post('/images', upload.single('image'), (req, res, next) => {
  
  var obj = {
      byUser : req.body.byUser,
      name: req.body.name,
      desc: req.body.desc,
      img: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/png'
      }
  }
  imgModel.create(obj, (err, item) => {
      if (err) {
          console.log(err);
      }
      else {
           //item.save();
          res.redirect('http://localhost:3000/profile');
      }
  });
}); 

//get profile image
//get all images in upload
app.get('/images/:email', (req, res) => {
  imgModel.find({ byUser : req.params.email}
    , (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
       {
         res.json(
          (items[items.length-1]).img.data.toString('base64')
         )
         //res.render('imagesPage', { items: items });
      }
  });
});


/* <-------------- ERROR HANDLING ----------> */
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
