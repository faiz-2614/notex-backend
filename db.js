const mongoose = require("mongoose");
const mongoUri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";


const connectToMongoose = () =>{
    mongoose.connect(mongoUri,()=>{
        console.log("Connected To Mongo")
    })
}

module.exports = connectToMongoose;