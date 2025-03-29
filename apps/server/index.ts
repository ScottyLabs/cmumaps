import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { clerkMiddleware } from "@clerk/express";
import { PrismaClient } from "@prisma/client";
import http from "http";

import buildingRoutes from "./routes/buildingRoutes";
import { notFoundHandler } from "./middleware/notFoundHandler";
import nodeRoutes from "./routes/nodeRoutes";
import { WebSocketService } from "./services/webSocketService";
import { checkAuth, socketAuth } from "./middleware/authMiddleware";
import { requireSocketId } from "./middleware/socketIdMiddleware";
import floorRoutes from "./routes/floorRoutes";
import edgeRoutes from "./routes/edgeRoutes";
import roomRoutes from "./routes/roomRoutes";
import poiRoutes from "./routes/poiRoutes";

export const prisma = new PrismaClient();
const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(","),
    credentials: true,
  }),
);
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
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/floors", checkAuth, floorRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/nodes", checkAuth, requireSocketId, nodeRoutes);
app.use("/api", checkAuth, requireSocketId, edgeRoutes);
app.use("/api/rooms", checkAuth, requireSocketId, roomRoutes);
app.use("/api/pois", checkAuth, requireSocketId, poiRoutes);
app.use(notFoundHandler);

const port = process.env.PORT || 80;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
