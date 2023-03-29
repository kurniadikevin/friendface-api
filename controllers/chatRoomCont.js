const ChatRoom = require('../models/chatRoom');

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
    .sort({ date: -1 })
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
    membersId : [req.body.currentUser, req.params.userId]
    })
    data.save(err=>{
        if(err){
            return next(err);
        } else{
            console.log('chat room created')
            res.sendStatus(200)
        }
    })
})

//POST make chatroom group
exports.create_new_group_chat_room=((req,res,next)=>{
    console.log(req.body.currentUser);
    console.log(req.body.userIdArr);
    const data= new ChatRoom({
       membersId : [req.body.currentUser, ...req.body.userIdArr]
       })
       data.save(err=>{
           if(err){
               return next(err);
           } else{
               console.log('chat room created')
               res.sendStatus(200)
           }
       })
   })