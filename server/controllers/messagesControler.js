const { ConverationCreate, CreateMessage, getmessageService, getConversationsServicebyUserId, getmessagesServicesByCobersationId } = require("../services/messagesServices");

const createConversation = async (req, res) => {
    try {
        const conversation = await ConverationCreate(req.body);
        res.status(200).json(conversation)
    } catch (err) {
        res.status(404).json({ Error: err.message })
    }
}

const CreateMessages = async (req, res) => {
    try {
        console.log(req, "hhhhhhhhhhhhhhhhhbbbbb");

        const message = await CreateMessage(req.body);
        req.io.emit("receive-message", message);
        res.status(200).json(message)
    } catch (err) {
        console.log(err, "hhhhhhhhhhhh");

        res.status(400).json({ Error: err.message })
    }
}
const getmesasgesControler = async (req, res) => {
    try {
        const Messages = await getmessageService()
        res.status(200).json(Messages)
    } catch (err) {
        res.status(400).json({ Error: err.message })
    }
}

const getCoversationbasedOnUserIdControler = async (req, res) => {
    try {
        const Conversation = await getConversationsServicebyUserId(req.params.id)
        res.status(200).json(Conversation)
    } catch (err) {
        res.status(400).json({ Error: err.message })
    }
}

const getmesasgesBasedConversationIdControler = async (req, res) => {
    try {
        const messages = await getmessagesServicesByCobersationId(req.params.id)
        res.status(200).json(messages)
    } catch (err) {
        res.status(400).json({ Error: err.message })
    }
}

module.exports = {
    createConversation,
    CreateMessages,
    getmesasgesControler,
    getCoversationbasedOnUserIdControler,
    getmesasgesBasedConversationIdControler
}