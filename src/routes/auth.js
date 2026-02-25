const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup",async (req,res) => {
    const { password,firstName,lastName,emailId,photoUrl,age,skil,about,gender } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
        firstName,
        lastName,emailId,password:passwordHash,photoUrl,age,skil,gender,about
    });
    try{

    await user.save();
    res.send("Data added Successfully...")}
    catch(err){
        res.status(400).send("Error saying the User:" + err.message)
    }
})

authRouter.post("/login" , async(req,res) => {
    try{
        const {emailId , password} = req.body;
        const user = await User.findOne({ emailId: emailId})
        if(!user){
            throw new Error("Invalid Credential !!!");
        }
        const isPasswordValid = await user.validatePassword (password)
        if(isPasswordValid){
            // Create a JWT token
            const token = await user.getJWT();

            // Add the token in cookie and send response to user  
            res.cookie("token", token, {
  httpOnly: true,
  secure: true,        // required for HTTPS (Vercel + Render)
  sameSite: "None",    // required when frontend & backend are different domains
  expires: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours
});
            res.send(user)
        }else{
            throw new Error("Invalid Credential !!")
        }
    }catch(err){
        res.status(400).send("ERROR:" + err.message)
    }
})

authRouter.post("/logout", async(req,res) => {
    res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none", // if using cross-site cookies
    secure: true      // if using https
    });
    res.send("Logout Successfully.. ")
})
module.exports = authRouter;