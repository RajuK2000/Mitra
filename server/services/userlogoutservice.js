const User = require("../models/usersModel");


const LogoutServer = async (req, res) => {
    console.log(req, "reqqq");

    const { email, islogin } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User LogOut Error"
            })
        }
        user.isLogin = islogin;
        await user.save()
        return res.status(200).json({
            success: false,
            message: "User LogOut Succefully"
        })
    } catch (err) {
        console.log(err, "rrrrrrrrrr");

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = LogoutServer