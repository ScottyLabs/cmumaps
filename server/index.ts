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
import { checkAuth, socketAuth } from "./middleware/authMiddleware.ts";
import { requireSocketId } from "./middleware/socketIdMiddleware.ts";
import floorRoutes from "./routes/floorRoutes.ts";
import edgeRoutes from "./routes/edgeRoutes.ts";
import roomRoutes from "./routes/roomRoutes.ts";
import poiRoutes from "./routes/poiRoutes.ts";

export const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server with Express app attached
const server = http.createServer(app);

// Initialize Socket.IO with CORS and authentication middleware
// https://socket.io/docs/v4/handling-cors/
const io = new Server(server, {
  cors: { origin: "*" },
});
io.use(socketAuth);

// Initialize WebSocket service
export const webSocketService = new WebSocketService(io);

// Clerk middleware to authenticate requests
app.use(clerkMiddleware());

// Routes
app.use("/api/floors", checkAuth, floorRoutes);
app.use("/api/buildings", checkAuth, buildingRoutes);
app.use("/api/nodes", checkAuth, requireSocketId, nodeRoutes);
app.use("/api", checkAuth, requireSocketId, edgeRoutes);
app.use("/api/rooms", checkAuth, requireSocketId, roomRoutes);
app.use("/api/pois", checkAuth, requireSocketId, poiRoutes);
app.use(notFoundHandler);

const port = 80;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
