const User = require("../models/usersModel");
const conversationModel = require("../models/conversationModel.js");
const messageSchema = require("../models/messageSchema.js");

const createMessageService = async (data) => {
    try {
        const { senderId, receiverId, message } = data;

        // Check if conversation exists
        let conversation = await conversationModel.findOne({
            participants: {
                $all: [senderId, receiverId]
            },
            $expr: {
                $eq: [{ $size: "$participants" }, 2]
            }
        });

        // Create conversation if not found
        if (!conversation) {
            conversation = await conversationModel.create({
                participants: [senderId, receiverId]
            });
        }

        // Create message
        const newMessage = await messageSchema.create({
            senderId,
            receiverId,
            conversationId: conversation._id,
            message
        });

        // Update last message
        conversation.lastMessage = message;
        await conversation.save();

        return newMessage;

    } catch (error) {
        console.log("Create Message Error:", error);
        throw new Error("Message not created");
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
    createMessageService,
    getuserService
};