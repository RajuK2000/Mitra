import { io } from "socket.io-client";

// const socket = io("http://localhost:3000");
const socket = io("http://localhost:3000", {
    withCredentials: true
});
socket.on("connect", () => {
    console.log("✅ SOCKET CONNECTED FROM FRONTEND:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("❌ SOCKET ERROR:", error.message);
});
export default socket;