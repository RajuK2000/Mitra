// const mongoose = require("mongoose");

// const conversationSchema = new mongoose.Schema({
//     type: {
//         type: String,
//         enum: ["private", "public"],
//         require: true,
//         default: "private"
//     },
//     participants: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         require: true
//     }],
//     lastmessage: {
//         type: String,
//         default: ""
//     },
//     lastMessageAt: {
//         type: Date,
//         default: Date.now
//     }
// },

//     {
//         timestamps: true
//     }
// )

// module.exports = mongoose.model("Conversation", conversationSchema)


const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["private", "group"],
      required: true
    },

    groupName: {
      type: String,
      default: null
    },

    groupImage: {
      type: String,
      default: null
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    lastMessage: {
      type: String,
      default: ""
    },

    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);