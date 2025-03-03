import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import buildingRoutes from "./routes/buildingRoutes.ts";
import { notFoundHandler } from "./middleware/notFoundHandler.ts";
import nodeRoutes from "./routes/nodeRoutes.ts";
import { WebSocketService } from "./services/webSocketService.ts";

export const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Configure this according to your security requirements
    methods: ["GET", "POST"],
  },
});

// Initialize WebSocket service
export const websocketService = new WebSocketService(io);

// Routes
app.use("/api/buildings", buildingRoutes);
app.use("/api/nodes", nodeRoutes);
app.use(notFoundHandler);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
