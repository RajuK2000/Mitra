const conversationModel = require("../models/conversationModel");
const messageSchema = require("../models/messageSchema");

const ConverationCreate = async (con) => {
  try {
    // Check only for private conversations
    if (con.type === "private") {
      const existingConversation = await conversationModel.findOne({
        type: "private",
        participants: {
          $all: con.participants
        },
        $expr: {
          $eq: [{ $size: "$participants" }, 2]
        }
      });

      if (existingConversation) {
        return existingConversation;
      }
    }

    // Create new conversation 
    const conversation = new conversationModel(con);
    const saveConver = await conversation.save();

    return saveConver;

  } catch (err) {
    console.log(err);
    throw new Error("Conversation Not Created!");
  }
};


const CreateMessage = async (data) => {
  try {
    const {
      senderId,
      receiverId,
      message,
      messageType = "text",
      fileUrl = null
    } = data;

    // Validate required fields
    if (!senderId || !receiverId) {
      throw new Error("SenderId and ReceiverId are required");
    }

    // Check existing conversation
    let conversation = await conversationModel.findOne({
      participants: {
        $all: [senderId, receiverId]
      },
      $expr: {
        $eq: [{ $size: "$participants" }, 2]
      }
    });

    // Create conversation if not exists
    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [senderId, receiverId],
        type:"private"
      });
    }

    // Create message
    const newMessage = new messageSchema({
      conversationId: conversation._id,
      senderId,
      receiverId,
      message,
      messageType,
      fileUrl,
      readBy: [senderId]
    });

    const savedMessage = await newMessage.save();

    // Update conversation last message
    conversation.lastMessage = message;

    await conversation.save();

    return {
      conversationId: conversation._id,
      message: savedMessage
    };

  } catch (err) {
    console.log("Create Message Error:", err);
    throw new Error(err.message);
  }
};

const getmessageService = async () => {
  try {
    const messages = await messageSchema.find()
    return messages
  } catch (err) {
    throw new Error(err, "Mesages not find")
  }
}

const getConversationsServicebyUserId = async (id) => {

  try {
    const conversations = await conversationModel
      .find({
        participants: id
      })
      .populate("participants", "_id name email")
      .sort({ updatedAt: -1 });

    if (conversations.length > 0) {
      return conversations;
    } else {
      throw new Error("There is no conversation with this user");
    }

  } catch (err) {
    throw new Error(err.message);
  }
};

const getmessagesServicesByCobersationId = async (Con_Id) => {
  try {
    const messages = await messageSchema.find({
      conversationId: Con_Id
    })
    return messages
  } catch (err) {
    throw new Error(err.message)
  }
}


module.exports = {
  ConverationCreate,
  CreateMessage,
  getmessageService,
  getConversationsServicebyUserId,
  getmessagesServicesByCobersationId
};