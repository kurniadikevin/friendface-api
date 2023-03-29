const Message = require('../models/message');

//GET message list all
exports.message_list_all=(req,res,next)=>{
    Message.find({}, "")
    .sort({ date: -1 })
    .exec(function (err, list) {
      if (err) {
        return next(err);
      }
      //Successful, so render
     res.send(list);  
    });
}

//GET chatroom byId
exports.message_byId=(req,res,next)=>{
    Message.find({ _id : req.params.messageId}, "")
    .sort({ date: -1 })
    .exec(function (err, list) {
      if (err) {
        return next(err);
      }
      //Successful, so render
     res.send(list);  
    });
}
