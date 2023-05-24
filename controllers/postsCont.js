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
  exports.post_list_page = (req, res,next) => {
    const pageLimit = 10;
    Post.find({}, "")
    .sort({ date: -1 })
    .limit(pageLimit)
    .skip(pageLimit * (req.params.pageNumber -1))
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
        // find post that author is equal to friend userId
        const queryList =()=>{ if((user_list[0].friends).length > 0){
         const result= (user_list[0].friends).map((friend)=>{
          return { 'author' : friend}
          });
          return result;
        } else {
          return [{ 'author' : req.params.userId}]
        }
      }

        Post.find({ 
          $or: [ {$or : queryList()}, { 'author' : req.params.userId}]
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

//GET display all friend post with paganation
  exports.post_list_friends_page = (req, res,next) => {
    const pageLimit= 10;
    User.find({ _id : req.params.userId},'')
    .exec(function(err,user_list){
        if(err){
            return next(err);
        }
        // find post that author is equal to friend email
        const queryList =()=>{ if((user_list[0].friends).length > 0){
         const result= (user_list[0].friends).map((friend)=>{
          return { 'author' : friend}
          });
          return result;
        } else {
          return [{ 'author' : req.params.userId}]
        }
      }
        
        Post.find({ 
          $or: [ {$or : queryList()}, { 'author' : req.params.userId}]
        }, "")
        .sort({ date: -1 })
        .populate("comment")
        .populate('author')
        .limit(10)
        .skip(pageLimit * (req.params.pageNumber -1))
        .exec(function (err, post_list) {
          if (err) {
            return next(err);
          }
          //Successful, so render
         res.send(post_list);
        });
    })
  };

  //GET post detail by Id
  exports.post_detail_byId=(req,res,next)=>{
    Post.find({ _id : req.params.postId}, "")
    
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

  //GET user post with paganation
  exports.user_post_list_page= (req,res,next)=>{
    const pageLimit= 10;
    Post.find({ author : req.params.userId}, "")
    .sort({ date: -1 })
    .populate("comment")
    .populate('author') 
    .limit(10)
    .skip(pageLimit * (req.params.pageNumber -1))
    .exec(function (err, post_list) {
      if (err) {
        return next(err);
      }
      //Successful, so render
     res.send(post_list);
    });
  }

  //GET user post count
  exports.user_post_count = (req,res,next)=>{
    Post.count({author : req.params.userId})
    .exec(function(err,post_count){
      if(err){
        return next(err)
      } 
      res.send({postCount : post_count})
    })
  }

  //POST create new post 
  exports.create_new_post= (req,res,next)=>{

    if(!req.body.text || !req.body.authorId){
      res.sendStatus(400)
    }

    const posts = new Post({
        text : req.body.text,
        author : req.body.authorId
    })
    posts.save(err=>{
      if(err){
        return next(err);
      } else{
        res.sendStatus(200)
      }
    })
  }

  //POST delete specific post by Author
  exports.post_detail_delete=(req,res,next)=>{
    Post.findOneAndDelete({_id :{ $eq : req.params.postId}},
      function(err,docs){
        if(err){
          return next(err)
        } else{
          console.log('Deleted : ',docs);
          res.send(200);
        }
    })
  }

   //update like on post
  exports.update_post_likes = ((req,res,next)=>{
    Post.findByIdAndUpdate(req.params.postId,{$addToSet : {likes : req.body.likeBy}},
      (err,post)=>{
      if(err){
        return next(err);
      }
      console.log('likes updated')
        next();
    });
  }); 

  // push notification for like
  exports.push_notification_like=(req,res,next)=>{
    // find post and find the author
    Post.find({_id : req.params.postId },{author: 1, text: 1})
      .exec((err,result)=>{
        const notifObj={
          postId : req.params.postId,
          byUser : req.body.likeBy,
          action : 'Liked',
          date : Date.now()
        }
        if(err){
          return next(err)
        }
        const authorId= (result[0].author).valueOf();
        console.log(authorId);
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
        })
      })  
  }
