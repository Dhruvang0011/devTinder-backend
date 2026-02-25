const mongoose = require("mongoose");

const connectdb = async () => {
    await mongoose.connect("mongodb+srv://DHRUVANG:DHRUVANG%400011@namastenode.wwzany4.mongodb.net/DevTinder")
}


module.exports = connectdb;