const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true ,
        ref : "User" //refrencing to User collection
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ["ignored","intrested","accepted","rejected"],
            message : `{VALUE} is incorrect status type`
        }
    }
},{
    timestamps : true
})

connectionRequestSchema.pre("save" , function(){
    const connectionRequest = this
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send conncection request to your-self!!")
    }
    // next()
})

const ConnectionRequest= new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequest;