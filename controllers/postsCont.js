const Post = require('../models/posts');
const User = require('../models/users');

// get Display list of posts
exports.post_list = (req, res,next) => {
    Post.find({}, "")
    .sort({ date: -1 })
    .populate("comment")
    .populate('author')
    .exec(function (err, post_list) {
      if (err) {
        return next(err);
      }
      //Successful, so render
     res.send(post_list);  
    });
  };

  //get display list of post with paganation

  const pageLimit = 10;
  exports.post_list_page = (req, res,next) => {
    Post.find({}, "")
    .sort({ date: -1 })
    .limit(pageLimit)
    .skip(pageLimit * Math.max(0,req.params.pageNumber))
    .populate("comment")
    .populate('author')
    .exec(function (err, post_list) {
      if (err) {
        return next(err);
      }
      //Successful, so render
     res.send(post_list);  
    });
  };

  //get display all friend post
  exports.post_list_friends = (req, res,next) => {

    User.find({ _id : req.params.userId},'')
    .exec(function(err,user_list){
        if(err){
            return next(err);
        }
        // find post that author is equal to friend email
        let queryList = (user_list[0].friends).map((friend)=>{
          return { 'author' : friend}
          });

        Post.find({ 
          $or: [ {$or : queryList}, { 'author' : req.params.userId}]
        }, "")
        .sort({ date: -1 })
        .populate("comment")
        .populate('author')
        .exec(function (err, post_list) {
          if (err) {
            return next(err);
          }
          //Successful, so render
         res.send(post_list);
        
        });
    })
  };

  //GET user post
  exports.user_post_list= (req,res,next)=>{
    Post.find({ author : req.params.userId}, "")
    .sort({ date: -1 })
    .populate("comment")
    .populate('author') 
    .exec(function (err, post_list) {
      if (err) {
        return next(err);
      }
      //Successful, so render
     res.send(post_list);
    
    });
  }


  //POST create new post 
  exports.create_new_post= (req,res,next)=>{

    const posts = new Post({
        text : req.body.text,
        author : req.body.authorId
    })
    posts.save(err=>{
      if(err){
        return next(err);
      }
    })
  }

   //update like on post
  exports.update_post_likes = ((req,res,next)=>{
    Post.findByIdAndUpdate(req.params.postId,{$push : {likes : req.body.likeBy}},
      (err,post)=>{
      if(err){
        return next(err);
      }
      console.log('likes updated')
      res
        .status(200)
        .end()
    });
  }); 
