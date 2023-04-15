const ChatRoom = require('../models/chatRoom');
const UserChat= require('../models/userChat');

//GET chatroom list
exports.find_chat_room_list_all=(req,res,next)=>{
    ChatRoom.find({}, "")
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
exports.find_chat_room_byId=(req,res,next)=>{
    ChatRoom.find({ _id : req.params.chatRoomId}, "")
    .sort({ modifiedAt: -1 })
    .populate('membersId')
    .populate("messagesId") 
    .exec(function (err, list) {
      if (err) {
        return next(err);
      }
      //Successful, so render
     res.send(list);  
    });
}


//prevent duplication middleware

//POST make chatroom between current user and specific user for two user
exports.create_new_private_chat_room=((req,res,next)=>{
 const data= new ChatRoom({
    membersId : [req.body.currentUser, req.params.userId],
   
    })
    data.save((err,result)=>{
        if(err){
            return next(err);
        } else{
            console.log(result);
            res.send(result);
        }
    })
})

//POST make chatroom group
// admin current user can be accessed by first element of array
exports.create_new_group_chat_room=((req,res,next)=>{
    const data= new ChatRoom({
       membersId : [req.body.currentUser, ...req.body.userIdArr],
       groupName : req.body.groupName
       })
       data.save((err,result)=>{
           if(err){
               return next(err);
           } else{
               console.log(result);
               res.send(result);
           }
       })
   })

exports.seen_messages_notification_chat_room=(req,res,next)=>{

  UserChat.updateMany({userId : req.body.currentUser},
    {$pull : {messageNotification : {  chatRoomId :  req.params.chatRoomId  }}},
    function(err){
        if(err){
            return next(err);
        } else{
            res.send(`Chat room with id ${req.params.chatRoomId} seen and removed from notification` );
        }
    }
 )
}

