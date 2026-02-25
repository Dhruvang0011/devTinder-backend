const express = require("express");
const messageRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const conversation = require("../models/conversation");
const Message = require("../models/message");

messageRouter.post("/message/send",userAuth,async (req,res)=> {
    try{
        const logedInUser = req.user;
        const { conversationId , text } = req.body;
        const senderId = logedInUser._id;

        const message = await Message.create({
            conversationId,
            senderId,
            text,
        }) 

        await conversation.findByIdAndUpdate(conversationId,{
            lastMessage : text,
            lastMessageSender : senderId,
        })

        res.json(message);

    }catch(err){
        res.status(400).send("Error:" + err.message);
    }
});

messageRouter.get("/message/:conversationId", userAuth , async(req,res) => {
    try{
        const { conversationId } = req.params;
        const messages = await Message.find({
            conversationId 
        }).sort({ createdAt : 1 });

        res.json(messages);
    }catch(err){
        res.status(400).send("Error:" + err.message);
    }
})
module.exports = messageRouter;