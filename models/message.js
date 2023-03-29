const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    author :  { type : Schema.Types.ObjectId, ref : "User" },
    text : {type: String,  },
    mediaContentUrl :{type : String} ,
    chatRoomId : { type : Schema.Types.ObjectId, ref : "ChatRoom" },
    sendAt : { type: Date, default: Date.now },
    readAt : { type: Date}
});

module.exports= mongoose.model("Message",MessagesSchema);