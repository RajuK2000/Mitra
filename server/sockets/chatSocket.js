const conversationModel = require("../models/conversationModel");
const {
  CreateMessage
} = require("../services/messagesServices");

module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);


    // Register logged-in user
    socket.on("register", (userId) => {

      socket.join(`user_${userId}`);

      console.log(
        `User ${userId} joined user_${userId}`
      );

    });


    // Private message
    socket.on("sendMessage", async (data) => {

      try {

        console.log("Message received:", data);

        const {
          receiverId,
          message,
          messageType,
          fileUrl
        } = data;


        // IMPORTANT:
        // Get sender from authenticated socket later.
        // For now, using socket.userId.
        const senderId = data.senderId;


        if (!senderId) {
          return socket.emit("messageError", {
            message: "User is not authenticated"
          });
        }


        // Use your existing service
        const result = await CreateMessage({
          senderId,
          receiverId,
          message,
          messageType,
          fileUrl
        });

        console.log(result, "resultresultresult");
        const conversation =
          await conversationModel.findById(
            result.conversationId
          );
        // Send saved message to receiver
        io.to(`user_${receiverId}`).emit(
          "receiveMessage",
          {
            ...result,
            conversation
          }
        );


        // Send back to sender
        io.to(`user_${senderId}`).emit(
          "messageSent",
          {
            ...result,
            conversation
          }
        );


      } catch (error) {

        console.error(
          "Socket message error:",
          error
        );

        socket.emit("messageError", {
          message: error.message
        });

      }

    });


    socket.on("disconnect", () => {

      console.log(
        "User disconnected:",
        socket.id
      );

    });

  });

};