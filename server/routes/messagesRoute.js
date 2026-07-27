const express = require("express");
const { createConversation, CreateMessages, getmesasgesControler,getCoversationbasedOnUserIdControler,getmesasgesBasedConversationIdControler } = require("../controllers/messagesControler");
 const router = express.Router();

 router.post("/createConversation",createConversation);
 router.post("/createMessaage",CreateMessages);
 router.get("/messages",getmesasgesControler);
 router.get("/messages/:id",getmesasgesBasedConversationIdControler);
 router.get("/conversations/:id",getCoversationbasedOnUserIdControler);

 module.exports = router