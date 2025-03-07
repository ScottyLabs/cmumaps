import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { clerkMiddleware } from "@clerk/express";
import http from "http";
import buildingRoutes from "./routes/buildingRoutes.ts";
import { notFoundHandler } from "./middleware/notFoundHandler.ts";
import nodeRoutes from "./routes/nodeRoutes.ts";
import { WebSocketService } from "./services/webSocketService.ts";

export const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server with Express app attached
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

// Clerk middleware to authenticate requests
app.use(clerkMiddleware());

const port = 80;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
