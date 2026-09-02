const mangoose = require("mongoose");

const UserSchema = new mangoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        default: 18,
    },
    mobile: {
        type: Number,
        require: true
    },
    isLogin: {
        type: Boolean,
        require: true
    }
});

const User = mangoose.model("User", UserSchema);
module.exports = User;