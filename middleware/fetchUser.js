const jwt = require("jsonwebtoken");

const JWT_SECRET = "notex";

const fetchUser = (req,res,next)=>{
    //Get USer From Jwt Token and id to req object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Access Denied"})
    }
    try{
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
    }
    catch(error){
        res.status(400).send({error:"Access Denied"})
    }

}

module.exports =fetchUser;