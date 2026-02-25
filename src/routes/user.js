const express = require("express")
const userRouter = express.Router()
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const user = require("../models/user")
const { connection } = require("mongoose")

// Get all the Pending connection Request for the loggedIn user 
userRouter.get("/user/requests/received", userAuth , async (req,res) => {
    try{
    const logedInUser = req.user;
    const allPandingRequest = await ConnectionRequest.find({
        toUserId : logedInUser._id,
        status : "intrested"
    }).populate("fromUserId" , "firstName lastName photoUrl age gender about skil")
    if(!allPandingRequest){
        throw new Error("No pending Request!!")
    }
    res.send(allPandingRequest)

    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
})
// Who accept my Request
userRouter.get("/user/connection" , userAuth , async(req,res) => {
    try{
        const logedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            status : "accepted",
            $or : [{ toUserId : logedInUser._id},{ fromUserId : logedInUser._id }]
        }).populate("fromUserId", "firstName lastName").populate("toUserId","firstName lastName")

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.equals(logedInUser._id) ){
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({
            message : "Connections:",
            data: data,
        })
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
})

// Feed Api
userRouter.get("/user/feed",userAuth , async(req,res) => {
    //  0. His own card
    //  1. His Connections
    //  2. ignored people 
    //  3. Already send connection request
    try{
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit>50 ? 50 : limit 
        const logedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            $or : [
                {toUserId : logedInUser._id},
                {fromUserId : logedInUser._id}
            ]
        }).select("fromUserId toUserId") 

        const hideUsers = new Set()
        connectionRequest.forEach((req) => {
            hideUsers.add(req.fromUserId.toString())
            hideUsers.add(req.toUserId.toString())
        })

        const users = await user.find({
            $and :[ {_id : {$nin : Array.from(hideUsers)}},
                   {_id : {$ne : logedInUser._id}}]
        }).select("firstName lastName photoUrl age gender about skil").skip((page-1)*limit).limit(limit)
        res.send(users)
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
})

userRouter.post("/user/search", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    let { firstName } = req.body;

    if (!firstName || !firstName.trim()) {
      return res.json([]);
    }

    firstName = firstName.trim();

    // Find all connection requests related to logged in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId },
        { toUserId: loggedInUserId }
      ]
    }).select("fromUserId toUserId");

    // Collect user IDs to exclude
    const excludedUserIds = new Set();

    connectionRequests.forEach((req) => {
      excludedUserIds.add(req.fromUserId.toString());
      excludedUserIds.add(req.toUserId.toString());
    });

    // Exclude self
    excludedUserIds.add(loggedInUserId.toString());

    // Search users
    const users = await user.find({
      _id: { $nin: Array.from(excludedUserIds) },
      firstName: { $regex: firstName, $options: "i" }
    }).select("firstName lastName photoUrl age gender about skil");

    res.json(users);

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});


module.exports = userRouter;