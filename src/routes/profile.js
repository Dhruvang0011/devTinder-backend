const express = require("express")
const validator = require("validator")
const bcrypt = require("bcrypt")
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth")
const { validateEditProfileData } = require("../utils/validation")

profileRouter.get("/profile/view" , userAuth ,async(req,res) => { 
    try{
    const user = req.user;
    res.send(user)
    }catch(err){
         res.status(400).send("Something Went Wrong !!")                      
    }
})

profileRouter.patch("/profile/update", userAuth , async (req,res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request.")
        }
        const logedInUser =  req.user;
        Object.keys(req.body).forEach(key => (logedInUser[key] = req.body[key]))

        await logedInUser.save()
        res.json({data:logedInUser})
        
    }catch(err){
        res.status(400).send("Error:" + err.message)                      
    }
})

profileRouter.patch("/profile/password",userAuth, async (req,res) => {
    try{
    const logedInUser = req.user
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const passValid = await logedInUser.validatePassword(currentPassword);
    if(passValid){
        const isNewPassValid = validator.isStrongPassword(newPassword);
        if(isNewPassValid){
            const newPassHash = await bcrypt.hash(newPassword,10)
            logedInUser.password = newPassHash
            await logedInUser.save()
        res.send("Password is Updated..")
        }else{
            throw new Error("Enter Strong Passs....")
        }
    }else{
        throw new Error("Something Went Wrong!!")
    }
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }

})

module.exports = profileRouter;