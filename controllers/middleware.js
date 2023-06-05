const jwt = require('jsonwebtoken');

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
