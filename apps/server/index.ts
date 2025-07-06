import http from "node:http";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import type { ErrorRequestHandler, Request, Response } from "express";
import express, { type NextFunction } from "express";
import { Server } from "socket.io";
import { ValidateError } from "tsoa";
import { RegisterRoutes } from "./build/routes";
import { prisma } from "./prisma";
import { socketAuth } from "./src/middleware/authMiddleware";
import { WebSocketService } from "./src/services/webSocketService";

const app = express();
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS_REGEX?.split(",").map(
    (origin) => new RegExp(origin),
  ),
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "8mb" }));

// Create HTTP server with Express app attached
const server = http.createServer(app);

// Initialize Socket.IO with CORS and authentication middleware
// https://socket.io/docs/v4/handling-cors/
const io = new Server(server, { cors: corsOptions });
io.use(socketAuth);

// Initialize WebSocket service
export const webSocketService = new WebSocketService(io);

// Clerk middleware to authenticate requests
app.use(clerkMiddleware());

// Routes
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

const apiRouter = express.Router();
RegisterRoutes(apiRouter);
app.use("/api", apiRouter);

// Routes for database population
// app.use("/api/drop-tables", checkAuth, dropTablesRoutes);
// app.use("/api/populate-table", checkAuth, populateTableRoutes);

// app.use("/api/floors", checkAuth, floorRoutes);
// // app.use("/api/buildings", buildingRoutes);
// app.use("/api/nodes", checkAuth, requireSocketId, nodeRoutes);
// app.use("/api", checkAuth, edgeRoutes);
// app.use("/api/rooms", checkAuth, requireSocketId, roomRoutes);
// app.use("/api/pois", checkAuth, requireSocketId, poiRoutes);
// app.use(notFoundHandler);

// Error Handling and Not Found Handlers from https://tsoa-community.github.io/docs/error-handling.html
app.use(function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  next();
} as ErrorRequestHandler);

app.use(function notFoundHandler(_req, res: Response) {
  res.status(404).send({ message: "Not Found" });
});

const port = process.env.PORT || 80;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
