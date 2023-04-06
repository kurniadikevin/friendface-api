const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
    membersId :   [{ type : Schema.Types.ObjectId, ref : "User" }],
    createdAt :   { type: Date, default: Date.now },
    modifiedAt : { type: Date },
    messagesId :  [{ type : Schema.Types.ObjectId, ref : "Message" }]
});

module.exports= mongoose.model("ChatRoom",ChatRoomSchema);