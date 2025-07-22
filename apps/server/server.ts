import fs from "node:fs";
import http from "node:http";
import cors from "cors";
import type { ErrorRequestHandler, Response } from "express";
import express from "express";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { RegisterRoutes } from "./build/routes";
import { prisma } from "./prisma";
import env from "./src/env";
// import { socketAuth } from "./src/middleware/authMiddleware";
import { WebSocketService } from "./src/services/webSocketService";
import { errorHandler } from "./src/utils/errorHandler";

const app = express();
app.use(express.json({ limit: "8mb" }));

if (env.NODE_ENV === "development") {
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
}

// Create HTTP server with Express app attached
const server = http.createServer(app);

// Initialize Socket.IO with authentication middleware
// https://socket.io/docs/v4/handling-cors/
const io = new Server(server);
// io.use(socketAuth);

// Initialize WebSocket service
export const webSocketService = new WebSocketService(io);

// Swagger
const file = fs.readFileSync("./build/swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);
app.use(express.static("./node_modules/swagger-ui-dist"));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
RegisterRoutes(app);
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// app.use("/api/floors", checkAuth, floorRoutes);
// // app.use("/api/buildings", buildingRoutes);
// app.use("/api/nodes", checkAuth, requireSocketId, nodeRoutes);
// app.use("/api", checkAuth, edgeRoutes);
// app.use("/api/rooms", checkAuth, requireSocketId, roomRoutes);
// app.use("/api/pois", checkAuth, requireSocketId, poiRoutes);

// Error Handling and Not Found Handlers from https://tsoa-community.github.io/docs/error-handling.html
app.use(errorHandler as ErrorRequestHandler);

app.use(function notFoundHandler(_req, res: Response) {
  res.status(404).send({ message: "Not Found" });
});

const port = env.SERVER_PORT;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
