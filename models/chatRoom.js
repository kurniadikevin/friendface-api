const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
    membersId :  { type: Array , default: []},
    createdAt :   { type: Date, default: Date.now }
});

module.exports= mongoose.model("ChatRoom",ChatRoomSchema);