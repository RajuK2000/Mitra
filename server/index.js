const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const port = 3000;

const userRoutes = require("./routes/userRoutes");
const userLogin = require("./routes/userlogin");
const messagesRoutes = require("./routes/messagesRoute");
const ConnectDB = require("./config/db");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
require("./sockets/chatSocket")(io);
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

ConnectDB();

app.use("/api", userRoutes);
app.use("/api", userLogin);
app.use("/api", messagesRoutes);

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

      // Join user room
    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});