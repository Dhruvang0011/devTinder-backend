const mongoose = require("mongoose");
const validators = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        minLength : 3, 
    },
    lastName : {
        type : String,
        minLength : 2,
    },
    photoUrl : {
        type : String,
        default : "https://media.istockphoto.com/id/2180592897/vector/user-icon-avatar-symbol-profile-sing-icon-vector-illustration.jpg?s=612x612&w=0&k=20&c=5M35n5KhzkJCgZtfbQrBKJzY3C9cNu4zJFl43qQEyfM=",
        validate(value){
            if(value && !validators.isURL(value)){
                throw new Error("Invalid PhotoUrl:" + value)
            }
        }        
    },
    emailId : {
        type : String,
        required : true,
        unique: true,
        validate(value){
            if(value && !validators.isEmail(value)){
                throw new Error("Invalid Email Address: " + value);
            }
        }
    },
    password : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        min : 18,
        max : 50
    },
    skil : {
        type : Array,
        required : true,
        maxLength : 10
    },
    about : {
        type : String,
    },
    gender : {
        type : String,
        enum : {
            values : ["male","female","other"],
            message : `{VALUE} is not valid gender type.`
        }
    }
},{
    timestamps : true
});

userSchema.methods.getJWT = async function (){ 
    const user = this;
     const token = await jwt.sign({_id : user._id},"DEV@TINDER0011",{
        expiresIn:  "7d",
     });
     return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const isPasswordValid = bcrypt.compare(passwordInputByUser ,this.password);

    return isPasswordValid;
}

module.exports = mongoose.model("User",userSchema);