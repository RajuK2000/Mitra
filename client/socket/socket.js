import { io } from "socket.io-client";

// const socket = io("http://localhost:3000");
const socket = io("https://mitra-lyao.onrender.com", {
    withCredentials: true
});

export default socket;