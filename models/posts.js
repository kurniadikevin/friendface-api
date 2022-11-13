const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const PostSchema = new Schema({
    text : {type: String,  },
    author :  { type : Schema.Types.ObjectId, ref : "User" },
    date :  { type: Date, default: Date.now },
    likes : { type: Array , default: []},
    comment : { type : Array, default : [] },
  /*  content : {} */
});


module.exports= mongoose.model("Post",PostSchema)


