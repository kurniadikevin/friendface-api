const User = require('../models/users');
const bcrypt =require('bcryptjs');
require('dotenv').config();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');


//get user all
exports.get_user_all = (req,res,next)=>{
    User.find({},'')
    .sort({ date : -1})
    .exec(function(err,user_list){
        if(err){
            return next(err);
        }
        //sucess
        res.send(user_list)
    })
}


//post create new user Sign-up
exports.post_new_user=((req,res,next)=>{
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      // if err, do something
      if(err){
        return next('password failed to proceed');
      }
    const user = new User({
      username: req.body.username,
      email : req.body.email,
      password: hashedPassword,
    }).save(err => {
      if (err) { 
        return next(err);
      }
      res.redirect("http://localhost:3000/login");
      });
    })
  }
)

 // put update user username
exports.put_update_username = ((req,res)=>{
  const user = new User({
    username : req.body.username,
    _id : req.body._id
  })
  User.findByIdAndUpdate(req.params.userId,user,{},(err, post) => {
    if (err) {
      return next(err);
    }
    // Successful: redirect to new product record.
    console.log('updated')
    res
      .status(200)  
      .end();
  });
});


//put update user profilePicture 
exports.put_update_user_profilePicture = ((req,res)=>{
  const user = new User({
    profilePicture : req.body.profilePicture,
    _id : req.body._id
  })
  User.findByIdAndUpdate(req.params.userId,user,{},(err, post) => {
    if (err) {
      return next(err);
    }
    // Successful: redirect to new product record.
    console.log('updated')
    res
      .status(200)  
      .end();
  });
});

/* <------------------------FACEBOOK SIGN UP AND SIGN IN ------------------> */
