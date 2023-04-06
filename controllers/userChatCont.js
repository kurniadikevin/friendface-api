const UserChat= require('../models/userChat');
const ChatRoom = require('../models/chatRoom');

//GET find all userChat
exports.find_user_chat_all=(req,res,next)=>{
    UserChat.find({ }, "")
    .sort({ date: -1 })
    .exec(function (err, list) {
      if (err) {
        return next(err);
      }
      //Successful, so render
     res.send(list);  
    });
}

// GET find userChat by userChat Id
exports.find_user_chat_by_userChatId=(req,res,next)=>{
  UserChat.find({ _id : req.params.userChatId}, "")
  .sort({ date: -1 })
  .exec(function (err, list) {
    if (err) {
      return next(err);
    }
    //Successful, so render
   res.send(list);  
  });
}

// GET find userChat by user Id
exports.find_user_chat_by_userId=(req,res,next)=>{
    UserChat.find({ userId : req.params.userId}, "")
    .sort({ date: -1 })
    .populate('chatRoomList')
    .exec(function (err, list) {
      if (err) {
        return next(err);
      }
      //Successful, so render
     res.send(list);  
    });
}

// POST create userChat
exports.create_user_chat =(async(req,res,next)=>{
  //make sure userChat no duplication per UserId
  const userChatExist = await UserChat.find({ userId : {$eq :req.params.userId}});
  if(userChatExist.length>0){
    return res.status(400).json({ error: 'User already have userChat' });
  } else{
    const data= new UserChat({
       userId: req.params.userId,
       chatRoomList : res.locals.arrayOfId
       })
       data.save(err=>{
           if(err){
               return next(err);
           } else{
               console.log('userChat created')
               res.sendStatus(200);
           }
       })
      }
   })

// POST update userChat to latest chatRoomList
exports.update_userChat_chatRoomList = ((req,res,next)=>{
  UserChat.findOneAndUpdate({userId : req.params.userId}, {chatRoomList : res.locals.arrayOfId},
    (err,list)=>{
    if(err){
      return next(err);
    }
    console.log('userChat chatRoomList updated')
    res.sendStatus(200);
  });
}); 


// populate chatRoomList with chatRoomId that belong to user
exports.populate_userchat_chatRoomList=(req,res,next)=>{
  ChatRoom.find({},({_id :1 , membersId : 1}))
  .exec(function (err, list) {
    if (err) {
      return next(err);
    }
    const filterList = list.filter((item)=>{
      return (item.membersId).includes(req.params.userId); 
    })
    //Successful, so render
    const arrayOfId = filterList.map((item)=>{
      return item._id;
    })
   res.locals.arrayOfId= arrayOfId;
   //res.send(arrayOfId);
   next();
  });
}

