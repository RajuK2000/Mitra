const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");

const Loginuser = async (req, res) => {
  const { email, isLogin } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist"
      });
    }

    // Update login status
    user.isLogin = isLogin;
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        isLogin: user.isLogin,
        name: user.name
      },
      "4578549856",

    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = Loginuser;