const express = require("express");
const conversationRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const Conversation = require("../models/conversation");

conversationRouter.get("/conversations", userAuth , async (req,res) => {
    try{
        const userId = req.user._id;
        const conversations = await Conversation.find({
            participants : userId
        })
        .populate("participants" , "firstName lastName photoUrl")
        .populate("lastMessageSender")
        .sort({updatedAt: -1});

        res.json(conversations);

    }catch(err){
        res.status(400).send("Error:" + err.message)
    }
})
module.exports = conversationRouter;