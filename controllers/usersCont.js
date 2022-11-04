const User = require('../models/users');
const bcrypt =require('bcryptjs');

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
      res.redirect("http://localhost:3000/");
      });
    })
  }
)

