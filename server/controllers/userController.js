const User = require("../models/usersModel");
const { CreateusersService,getuserService } = require("../services/userServices")

const userCreation =async (req,res)=>{
    console.log(req.body,"reqreq");
    
    try{
        const user = await CreateusersService(req.body);
        res.status(200).json(user)
    }catch(err){
        res.status(400).json({Error: err.message});
    }
}

const getuser = async (req,res)=>{
    try{
const users = await getuserService()
console.log(users,"usersusers");

res.status(200).json(users)
    }catch(err){
    res.status(400).json({Error: err.message});

    }
}

const deleteAllUsersService = async () => {
  try {
    const result = await User.deleteMany({});
    return result; // { acknowledged: true, deletedCount: X }
  } catch (err) {
    throw new Error(err.message || "Delete failed");
  }
};

const deleteUserService = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new Error("User not found");
    }

    return deletedUser;
  } catch (err) {
    throw new Error(err.message || "Delete failed");
  }
};

module.exports={
    userCreation,
    getuser,
    deleteAllUsersService,
    deleteUserService
}