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
     res.redirect('http://localhost:3000/')
    });
  };

  