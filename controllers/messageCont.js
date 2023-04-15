const Message = require('../models/message');
const ChatRoom= require('../models/chatRoom');
const UserChat = require('../models/userChat');

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
            next();
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

 //push notification message to userChat
 exports.push_notification_message=(req,res,next)=>{

  // find userChat from chatRoomId membersId
  ChatRoom.find({_id : req.params.chatRoomId}, {membersId : 1})
    .sort({ date: -1 })
    .exec(function (err, list) {
      if (err) {
        return next(err);
      }
      memberList=list[0].membersId;
      const currentUserIdStr= req.body.currentUser;
      //filter member id for foreign user only
      const foreignMemberId= memberList.filter((item)=>{
        return item != currentUserIdStr;
      })
      const foreignMemberIdStr= foreignMemberId.map((item)=>{
        return item.toString()
      })
      console.log(foreignMemberIdStr);
     const updateData ={
     /*  message_id : _id, */
      chatRoomId : req.params.chatRoomId,
      authorId : req.body.currentUser
     }
     
     UserChat.updateMany({ userId : {$in : foreignMemberIdStr}},
      { $push : {messageNotification : updateData}}, {multi: true} ,
      function(err,docs){
        if(err){
          return next(err);
        } else{
          console.log("Updated Docs : ", docs);
          res.send(docs);
      }
      })
    });
 }