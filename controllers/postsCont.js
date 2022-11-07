const Post = require('../models/posts');


// get Display list of posts
exports.post_list = (req, res,next) => {
    Post.find({}, "")
    .sort({ date: -1 })
    .populate("comment")
    .exec(function (err, post_list) {
      if (err) {
        return next(err);
      }
      //Successful, so render
     res.send(post_list);
    
    });
  };

  //GET specific post


  //POST create new post 
  exports.create_new_post= (req,res,next)=>{

    const posts = new Post({
        text : req.body.text,
        author : req.body.email
    })
    posts.save(err=>{
      if(err){
        return next(err);
      }
     
    })
   
  }

  