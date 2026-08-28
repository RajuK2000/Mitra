import { io } from "socket.io-client";

// const socket = io("https://mitra-lyao.onrender.com");
const socket = io("https://mitra-lyao.onrender.com", {
    withCredentials: true
});
socket.on("connect", () => {
    console.log("✅ SOCKET CONNECTED FROM FRONTEND:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("❌ SOCKET ERROR:", error.message);
});
export default socket;