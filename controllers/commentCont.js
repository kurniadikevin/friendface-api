const Comment = require('../models/comments');
const Post = require('../models/posts');
const User= require('../models/users');


 exports.create_new_comment = ((req,res,next)=>{

    const comment = {
        text : req.body.text,
        author : req.body.commentBy,
        comment : [],
        likes : [],
        date : Date.now()
    }
    Post.findByIdAndUpdate(req.params.postId,{$push : {comment : comment}},
      (err,post)=>{
      if(err){
        return next(err);
      }
      console.log('comment posted')
        next()
    });
  }); 


  // push notification for comments
  exports.push_notification_comment=(req,res,next)=>{
    // find post and find the author
    Post.find({_id : req.params.postId },{author: 1, text: 1})
      .exec((err,result)=>{
        const notifObj={
          postId : req.params.postId,
          byUser : req.body.commentBy,
          action : 'Commented',
          date : Date.now(),
        }
        if(err){
          return next(err)
        }
        const authorId= (result[0].author).valueOf();
        console.log(authorId);
        //if authorId not same as req.body.commentBy._id

        if(authorId !== (req.body.commentBy)._id){
         // push notification to author postNotification
        User.findByIdAndUpdate(authorId,{$addToSet : {postNotification : notifObj}},
        (err,post)=>{
          if(err){
            console.log(err);
            return next(err);
          } 
          console.log('push notification sucess');
          res
          .status(200)
          .end()
        })} else{
          console.log('notification not pushed because you comment your own post')
          res.sendStatus(200)
        }
      })  
  }
