const Message = require('../models/message');
const ChatRoom= require('../models/chatRoom');

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

//POST create message
exports.create_new_message=((req,res,next)=>{
  const data= new Message({
    author : req.body.currentUser,
    text : req.body.text,
    mediaContentUrl : req.body.mediaUrl,
    chatRoomId : req.params.chatRoomId,
     })
     data.save(err=>{
         if(err){
             return next(err);
         } else{
             console.log('message created');
             console.log(data)
             assignIdToChatRoom(data._id,req.params.chatRoomId);
             res.sendStatus(200);
         }
     })
 })

 // assign message id to chat room
 const assignIdToChatRoom=(message_Id,chatRoom_Id)=>{
  const update={
    $push : {messagesId : message_Id },
    modifiedAt : Date.now(),
}
  ChatRoom.findByIdAndUpdate(chatRoom_Id, update,
    (err)=>{
      if(err){
        return next(err);
      }
      console.log('chatRoom messagesId updated')
    } )
 }