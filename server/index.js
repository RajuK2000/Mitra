require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const port = process.env.PORT || 3000;

const userRoutes = require("./routes/userRoutes");
const userLogin = require("./routes/userlogin");
const messagesRoutes = require("./routes/messagesRoute");
const ConnectDB = require("./config/db");

const allowedOrigins = [
    "http://localhost:5173",
    "https://mitra-eta-olive.vercel.app"
];

// Express CORS
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

// Socket.IO CORS
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    }
});

// Make io available inside routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

require("./sockets/chatSocket")(io);

ConnectDB();

app.use("/api", userRoutes);
app.use("/api", userLogin);
app.use("/api", messagesRoutes);

app.get("/", (req, res) => {
    res.send("Mitra Server Running");
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(port, "0.0.0.0", () => {
    console.log(`Mitra server running on port ${port}`);
});