const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const PostSchema = new Schema({
    text : {type: String,  },
    author : { type : String, required : true},
    date :  { type: Date, default: Date.now },
    likes : { type: Number, default: 0},
    comment : { type : Schema.Types.ObjectId, ref : "Comment" },
  /*  content : {} */
});

//virtual post url
PostSchema.virtual("url").get(function(){
    return `/posts/${this._id}`;
})

module.exports= mongoose.model("Post",PostSchema)


