const Comment = require('../models/comments');
const Post = require('../models/posts');


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
      res
        .status(200)
        .end()
    });
  }); 
