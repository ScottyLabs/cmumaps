import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import process from "node:process";
import { toNodeHandler } from "better-auth/node";
import { YAML } from "bun";
import cors, { type CorsOptions } from "cors";
import type { ErrorRequestHandler } from "express";
import express from "express";
import { Server } from "socket.io";
import swaggerUi, { type JsonObject } from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes.ts";
import { prisma } from "../prisma/index.ts";
import { env } from "./env.ts";
import { auth } from "./lib/auth.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { notFoundHandler } from "./middleware/notFoundHandler.ts";
import { socketAuth } from "./middleware/socketAuth.ts";
import { WebSocketService } from "./services/webSocketService.ts";

const app = express();
app.use(express.json({ limit: "1mb" }));

// Define CORS options
const corsOptions: CorsOptions = {
  origin: env.ALLOWED_ORIGINS_REGEX?.split(",").map(
    (origin) => new RegExp(origin),
  ),
  credentials: true,
};
app.use(cors(corsOptions));

// Create HTTP server with Express app attached
const server = http.createServer(app);

// Initialize Socket.IO with authentication middleware
// https://socket.io/docs/v4/handling-cors/
const io = new Server(server, { cors: corsOptions });
io.use(socketAuth);

// Initialize WebSocket service
export const webSocketService = new WebSocketService(io);

// Setup Authentication
// Setup Authentication: https://www.better-auth.com/docs/integrations/express
app.all("/api/auth/*splat", toNodeHandler(auth));

// Swagger and OpenAPI JSON
const swaggerYaml = fs.readFileSync("./build/swagger.yaml", "utf8");
const swaggerJson = YAML.parse(swaggerYaml) as JsonObject;

// Log the request for the swagger-ui-bundle.js file
app.get("/swagger/swagger-ui-bundle.js", (req, res, next) => {
  const filePath = path.join(
    __dirname,
    "../public/swagger-ui/swagger-ui-bundle.js",
  );

  /* --------------------------------------------------
   * 1️⃣ Log the request
   * -------------------------------------------------- */
  console.log(
    `[SWAGGER] Request
  URL: ${req.originalUrl}
  IP: ${req.ip}
  UA: ${req.headers["user-agent"]}`,
  );

  /* --------------------------------------------------
   * 2️⃣ Log first 500 chars of file on disk
   * -------------------------------------------------- */
  try {
    const filePreview = fs.readFileSync(filePath, "utf8").slice(0, 500);
    console.log(`[SWAGGER] File (disk) first 500 chars:\n${filePreview}`);
  } catch (err) {
    console.error(
      "[SWAGGER] Failed to read swagger-ui-bundle.js from disk",
      err,
    );
  }

  /* --------------------------------------------------
   * 3️⃣ Capture first 500 chars of the response
   * -------------------------------------------------- */
  const originalEnd = res.end.bind(res);
  let responseBuffer = Buffer.alloc(0);
  let logged = false;

  // @ts-expect-error
  res.end = (chunk?: Buffer | string, encoding?: BufferEncoding) => {
    if (chunk !== undefined && !logged) {
      responseBuffer = Buffer.concat([
        responseBuffer,
        Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding),
      ]);

      const preview = responseBuffer.toString("utf8").slice(0, 500);

      console.log(`[SWAGGER] Response first 500 chars:\n${preview}`);

      logged = true;
    }

    return originalEnd(chunk, encoding ?? "utf8");
  };

  next(); // allow express.static to serve the file
});

app.use(
  "/swagger",
  express.static(path.join(__dirname, "../public/swagger-ui")),
  swaggerUi.serve,
  swaggerUi.setup(swaggerJson),
);
app.get("/openapi.json", (_req, res) => {
  res.status(200).send(swaggerJson);
});

// Routes
RegisterRoutes(app);
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error Handling and Not Found Handlers
app.use(errorHandler as ErrorRequestHandler);
app.use(notFoundHandler);

const port = env.SERVER_PORT;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
