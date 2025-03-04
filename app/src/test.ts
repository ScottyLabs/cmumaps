// Import Socket.IO client
import { io } from "socket.io-client";

// Connect to the WebSocket server
const socket = io("http://localhost:80", {
  transports: ["websocket"],
  autoConnect: true,
});

// Event handlers
socket.on("connect", () => {
  console.log("Connected to WebSocket server");
  console.log("Socket ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});

// Error handling
socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});
