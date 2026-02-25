const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async  (req,res,next) => {
    // Read The token form the Request coookie
    try{
    const { token } = req.cookies;
    if(!token){
        return res.status(401).send("Please Login!!")
    }

    // Validate the Token
    const decodedData = jwt.verify(token,"DEV@TINDER0011")

    // Find the User
    const user = await User.findById(decodedData._id)

    if(!user){
        throw new Error("User Not Found !!!")
    }
    req.user = user;  
    next(); 
    }catch(err){
        res.status(400).send("error:" + err.message)
    }
};

module.exports={
    userAuth
}