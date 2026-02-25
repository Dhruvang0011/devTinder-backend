const validator = require("validator")

const  validateEditProfileData= (req) => {
    const allowedEditFields = ["firstName" , "lastName" , "photoUrl" , "gender" , "age" , "about" , "skil"]
    const validFields = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
    
    if(!validFields){
    return false;
    }

    if (req.body.photoUrl && !validator.isURL(req.body.photoUrl)) {
    throw new Error("Invalid photo URL");
  }

  if (req.body.age && (typeof req.body.age !== "number" || req.body.age < 18)) {
    throw new Error("Not a Valid Age!!!");
  }

  if (req.body.gender && !["male", "female", "other"].includes(req.body.gender)) {
    throw new Error("Invalid gender");
  }

  return true;    
}

module.exports = {
    validateEditProfileData
}