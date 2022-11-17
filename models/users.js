const { text } = require('express');
const mongoose = require('mongoose');

const Schema= mongoose.Schema;

const UserSchema= new Schema({
    username : {type : String},
    email : {type : String , required:true}, 
    password : { type: String, required: true},
    friends : { type:Array  },
    profilePicture : {type:String },
    friendRequest : {type:Array}
}) 

//virtual user url
UserSchema.virtual("url").get(function(){
    return `/users/${this._id}`;
})

module.exports= mongoose.model("User",UserSchema);