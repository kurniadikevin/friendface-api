var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const compression = require("compression");
const helmet = require("helmet");
require('dotenv').config();
const bcrypt =require('bcryptjs');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var json= require('body-parser');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml')

const multer = require('multer');
var fs = require('fs');

//swagger document input and convert yaml to json
const file  = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

//import model
const User = require('./models/users');
const Post = require('./models/posts');
const imgModel = require('./models/images');


// router import
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter =  require('./routes/posts');
//var imagesRouter = require('./routes/images');
const commentsRouter = require('./routes/comments');
const chatRoomRouter= require('./routes/chatRoom');
const messageRouter = require('./routes/message');
const userChatRouter = require('./routes/userChat');


var app = express();

app.use(cors({
  /* origin : 'http://localhost:3000', */
  origin : ['http://localhost:3000','https://editor.swagger.io','http://127.0.0.1:3000'],
  credentials : true
}));

//integrate MONGO DB
const mongoose = require("mongoose");
const dev_db_url = process.env.DATABASE_URL;
 const mongoDB = process.env.MONGODB_URI || dev_db_url; 
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(compression());
//app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//make static file for images uploads
app.use(express.static('uploads'))

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
app.use('/comments',commentsRouter);
app.use('/chatRoom',chatRoomRouter);
app.use('/message',messageRouter);
app.use('/userChat',userChatRouter);
 

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

/* <-----------multer for image models management-----------------> */
   var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

// limit file size too 500kb
  const limits= {fileSize : 0.5 * 1024 * 1024}
  
var upload = multer({ storage: storage, limits: limits ,fileFilter: function(_req, file, cb){
  checkFileType(file, cb);
  }});

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

function checkFileType(file, cb){
  // Allowed ext file images
  const filetypes = /jpeg|jpg|png|gif|ico/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else {
    return cb(null, false);
  }
}

const removeUserProfileImage=(req,res,next)=>{
  console.log(req.user);
      if(req.user?.profilePicture){
      console.log('delete');
      removeImage(req.user.profilePicture);
      next()
      } else{
        console.log('no profile picture found');
        next()
      }
  }

// post images upload for profile picture
app.post('/images', upload.single('image'),removeUserProfileImage, (req, res, next) => {
  var obj = {
      byUser : req.body.byUser,
      name: req.body.name,
      desc: req.body.desc,
      url : (path.join(__dirname + '/uploads/' + req.file.filename)),
      img: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/png'
      }
  }
  var userImgUrl = {
    profilePicture :  req.file.filename,
  }
  imgModel.create(obj, (err, item) => {
      if (err) {
          console.log(err);
      }
      else {
        console.log('update user')
        User.findByIdAndUpdate(req.body._id, userImgUrl,{}, (err, item) => {
          if (err) {
              console.log(err);
          }
          else {
               //item.save();
               console.log('updated');
               res.redirect('http://localhost:3000/profile');         
          }
      }); 
      }
  });
}); 

//get profile image 
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
      } 
  });
});

//post image upload for post imageContent
app.post('/postImages', upload.single('image'), (req, res, next) => {
  
  const postImageUrl = new Post({
    author: req.body.authorId,
    imageContent :  req.file.filename,
    text : req.body.text
  })
        postImageUrl.save((err)=>{
         if(err){
           return next(err);
        } else{
            //item.save();
            console.log('post image sucessful');
            res.send(400);
        }
        }
        )
      }
);


const removeImage=(file)=>{
  const fileName=file;
  const directoryPath= "./uploads/";
  try{
    fs.unlinkSync(directoryPath + fileName);
    console.log("Delete File successfully.");
  } catch (error) {
    console.log(error);
  }
}


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
