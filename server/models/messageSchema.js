const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true
        },
        message: {
            type: String,
            trim: true
        },
        messageType: {
            type: String,
            enum: ["text", "image", "video", "file"],
            default: "text"
        },
        fileUrl: {
            type: String,
            default: null
        },
        readBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }]
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Message", messageSchema)