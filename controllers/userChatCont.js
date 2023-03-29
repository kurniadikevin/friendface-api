const UserChat= require('../models/userChat');

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

// GET find userChat by user Id
exports.find_user_chat_by_userId=(req,res,next)=>{
    UserChat.find({ _id : req.params.userId}, "")
    .sort({ date: -1 })
    .exec(function (err, list) {
      if (err) {
        return next(err);
      }
      //Successful, so render
     res.send(list);  
    });
}

// POST create userChat
exports.create_user_chat =((req,res,next)=>{

    const data= new UserChat({
       userId: req.params.userId,
       })
       data.save(err=>{
           if(err){
               return next(err);
           } else{
               console.log('userChat created')
               console.log(data);
               res.sendStatus(200)
           }
       })
   })

//make sure userChat no duplication per UserId

// populate chatRoomList with chatRoomId that belong to user
