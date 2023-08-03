const jwt = require('jsonwebtoken');
const firebase = require('../db');  // reference to firebase db 
require("firebase/storage"); // must be required for this to work
const storage = firebase.storage// create a reference to storage
global.XMLHttpRequest = require("xhr2")

//Verify Token
exports.verifyToken =(req,res,next)=>{
    //Auth header value = > send token into header
    const bearerHeader = req.headers.authorization;
    //check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        //split the space at the bearer
        const bearer = bearerHeader.split(' ');
        //Get token from string
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        
        //next middleweare
        jwt.verify(req.token,process.env.JWT_BEARER_SECRETKEY,(err)=>{
            if(err)
                res.sendStatus(403);
            else{
               next()
            }
        })

    }else{
        //Fobidden
        res.sendStatus(403);
    }
}

exports.addImage = async (req, res) => {
    console.log('addimage')
  try {
      // Grab the file
      const file = req.file;
      // Format the filename
      const timestamp = Date.now();
      const name = file.originalname.split(".")[0];
      const type = file.originalname.split(".")[1];
      const fileName = `${name}_${timestamp}.${type}`;
       // Step 1. Create reference for file name in cloud storage 
      const imageRef = storage.child(fileName);
      // Step 2. Upload the file in the bucket storage
      const snapshot = await imageRef.put(file.buffer);
      // Step 3. Grab the public url
      const downloadURL = await snapshot.ref.getDownloadURL();
      
      res.send(downloadURL);
   }  catch (error) {
      console.log (error)
      res.status(400).send(error.message);
  }
}

