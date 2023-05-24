const jwt = require('jsonwebtoken');

//Verify Token
exports.verifyToken =(req,res,next)=>{
    //Auth header value = > send token into header

    const bearerHeader = req.headers.authorization;
    //console.log(req.token)
    //check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        //split the space at the bearer
        const bearer = bearerHeader.split(' ');
        //Get token from string
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        
        //next middleweare
        next();

    }else{
        //Fobidden
        res.sendStatus(403);
    }
}

exports.jwtVerify=(req,res,next)=>{
    jwt.verify(req.token,'secretkey',(err)=>{
        if(err)
            res.sendStatus(403);
        else{
           next()
        }
    })
}