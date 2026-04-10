const User = require("../models/usersModel");

const CreateusersService = async (data)=>{
    try{
const user = new User(data); 
    const savedUser = await user.save();
    return savedUser;        
    }catch(err){
    console.log(err,"errerr");
    throw new Error("User Not Created");  
    }
}

const getuserService = async ()=>{
try{
    const users = await User.find()
    return users;  
}catch(err){
    throw new Error(err,"Users Not found")
}
}




module.exports={
    CreateusersService,
    getuserService,
  
}