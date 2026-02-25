const express = require("express")
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const Conversation = require("../models/conversation")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId; 

        const isValidtoUserId = await User.findById(toUserId)
        if(!isValidtoUserId){
            throw new Error("Useer Not found..")
        }

        const status =  req.params.status
        const allowedstatus = ["intrested","ignored"]
        if(!allowedstatus.includes(status)){
            throw new Error("this status not allowed...")
        }
        // If there is an existing connection request 
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId , toUserId},
                {fromUserId : toUserId, toUserId : fromUserId}
            ]
        })
        if(existingConnectionRequest){
            throw new Error("connection Request Already exist!!")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()
        res.send("Connection Request send.")

    }catch(err){
        res.status(400).send("Error: " + err.message)
    }

})

requestRouter.post("/request/review/:status/:requestId",userAuth, async(req,res) => {
    try{
    const logedInUser = req.user;

    const { status,requestId } =  req.params
    // checking the Status
    const allowedstatus = ["accepted","rejected"]
    if(!allowedstatus.includes(status)){
        throw new Error("this status not allowed...")
    }
    // Check the RequestId 
    const connectionRequest = await ConnectionRequest.findOneAndUpdate({
        _id : requestId,
        toUserId : logedInUser._id,
        status : "intrested"
    },
    {
        $set : { status : status }
    },{
        new : true
    })
    if(!connectionRequest){
        return res.status(404).json({ message :"Connection request not found "})
    }

    if(status === "accepted"){
        const existingConversation = await Conversation.findOne({
        participants: {
            $all :[connectionRequest.fromUserId,connectionRequest.toUserId]
        }
        });
        if(!existingConversation){
            await Conversation.create({
                participants:[
                    connectionRequest.fromUserId,
                    connectionRequest.toUserId
                ]
            })
        }
    }

    res.json({message : "Connection Request :" + status })

    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
})

module.exports = requestRouter;
