const User = require("../models/usersModel");

const Loginuser = async (req,res) => {
  const { email } = req.body;

  try {
    const existUser = await User.findOne({email });
if(existUser){
    return res.status(200).json(existUser)
}else{
    return res.status(404).json({
  success: false,
  message: "User does not exist"
});
}
  } catch (err) {
    console.log(err, "error");
  }
};


module.exports = Loginuser;