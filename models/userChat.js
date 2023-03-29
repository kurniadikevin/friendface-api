const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserChatSchema = new Schema({
    userId :  { type : Schema.Types.ObjectId, ref : "User" },
    chatRoomList :  { type: Array , default: []}
});

module.exports= mongoose.model("UserChat",UserChatSchema);