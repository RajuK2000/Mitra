const mongoose = require("mongoose")

const ConnectDB = async ()=>{
    try{
await mongoose.connect("mongodb://127.0.0.1:27017/myChats");
console.log("Database Connected!");

    }catch(err){
        console.log("Mongoos Connection Error",err);
        
    }
}
module.exports = ConnectDB