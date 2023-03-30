const User = require('../models/users');
const bcrypt =require('bcryptjs');
require('dotenv').config();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');


//get user all
exports.get_user_all = (req,res,next)=>{
    User.find({},({ _id : 0, password : 0}))
    .sort({ date : -1})
    .exec(function(err,user_list){
        if(err){
            return next(err);
        }
        //success
        res.send(user_list)
    })
}

// get user by  query
exports.get_user_search = (req,res,next)=>{
  User.find({ $or : [{ username : req.params.input}, {email : req.params.input}] }
    ,'email username')
  .sort({ date : -1})
  .exec(function(err,user_list){
      if(err){
          return next(err);
      }
      //success
      res.send(user_list)
  })
}

exports.get_user_search_data = (req,res,next)=>{
  User.find({ }
    ,'email username')
  .sort({ date : -1})
  .exec(function(err,user_list){
      if(err){
          return next(err);
      }
      //success
      res.send(user_list)
  })
}

//get top 5 new user
exports.get_new_user = (req,res,next)=>{
  User.find({},({ friends: 0, password : 0}))
  .sort({ _id : -1})
  .limit(5)
  .exec(function(err,user_list){
      if(err){
          return next(err);
      }
      //sucess
      res.send(user_list)
  })
}


//post create new user Sign-up
exports.post_new_user=(async (req,res,next)=>{

const emailExist = await User.find({ email : {$eq :req.body.email}});
    if(emailExist.length > 0){
      return res.status(400).json({ error: 'Email already used' });
    } else{
         bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      // if err, do something
      if(err){
        return next('password failed to proceed');
      }
    const user = new User({
     
      email : req.body.email,
      password: hashedPassword,
    }).save(err => {
      if (err) { 
        return next(err);
      }
      res.send(200);
      });
    })
    }
  }
)



//get user detail by id
exports.get_user_detail =(req,res,next)=>{
  User.find({ _id : req.params.userId},({ _id : 0, password : 0}))
  .exec(function(err,user_list){
      if(err){
          return next(err);
      }
      //sucess
      res.send(user_list)
  })
}

//get user simplified email and username only
exports.get_user_detail_simplified =(req,res,next)=>{
  User.find({ _id : req.params.userId},({  email : 1,username : 1}))
  .exec(function(err,user_list){
      if(err){
          return next(err);
      }
      //sucess
      res.send(user_list)
  })
}


 // put update user username
exports.put_update_username = ((req,res)=>{
  const user =  {
    username : req.body.username,
    _id : req.body._id
  }
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


//put update user profilePicture   NOT USED BECAUSE IMAGE PROFILE LOADED IN APP.JS
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

// send friend request
exports.post_user_friend_request= ((req,res,next)=>{
  User.findByIdAndUpdate(req.params.userId,{$addToSet : {friendRequest : req.body.requestData}},
    (err,post)=>{
    if(err){
      return next(err);
    }
    console.log('friend request send')
    res
      .status(200)
      .end()
  });
})

//post accept friend request
exports.post_accept_friend_request=((req,res,next)=>{
  //remove friend request
  User.findByIdAndUpdate(req.params.userId,{$pull : {friendRequest : req.body.requestData}},
    (err,post)=>{
    if(err){
      return next(err);
    } else{
    console.log('friend request removed')

   //add friend list to receiver
  User.findByIdAndUpdate(req.params.userId,{$addToSet : {friends : req.body.newFriend}},
    (err,post)=>{
    if(err){
      return next(err);
    } else{
    console.log('friend list added to receiver');
 
    //add friend list to sender
  User.findByIdAndUpdate(req.body.newFriend._id,{$addToSet : {friends : req.body.newFriendReceiver}},
      (err,post)=>{
      if(err){
        return next(err);
      }
      console.log('friend list added to sender');
      res
        .status(200)
        .end()
    });
   } 
  });
  }
  }); 
})

//post decline friend request
exports.post_decline_friend_request=((req,res,next)=>{
  //remove friend request
  User.findByIdAndUpdate(req.params.userId,{$pull : {friendRequest : req.body.requestData}},
    (err,post)=>{
    if(err){
      return next(err);
    }
    res.status(200)
    console.log('friend request decline')
  })
})

// get user profilePicture by id parameter 
exports.get_user_profile_picture_byId=((req,res,next)=>{
  User.find({ _id : req.params.userId},({ _id : 0, password : 0,friends: 0,friendRequest: 0}))
  .exec(function(err,user_list){
     let imageName= user_list[0].profilePicture;
     if(!imageName){
      imageName='noPicture.png';
     }
      if(err){
          next(err);
      }
      //sucess
      res.redirect(`http://localhost:5000/${imageName}`)
  })
})

