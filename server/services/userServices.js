const User = require("../models/usersModel");
// const conversationModel = require("../models/conversationModel.js");
// const messageSchema = require("../models/messageSchema.js");

const createUserService = async (data) => {
    try {
        const user = User.create(data)
        return user;

    } catch (error) {
        console.log("Create User Error:", error);
        throw new Error("User not created");
    }
};

const getuserService = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (err) {
        throw new Error("Users not found");
    }
};

module.exports = {
    createUserService,
    getuserService
};