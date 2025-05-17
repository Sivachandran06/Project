const mongoose = require("mongoose");

const contentDb =async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("Mongoose connected")
    }catch(err){
        console.log("error Connecting to MongooseDb", err);
        process.exit(1); 
    }
}
module.exports = contentDb;