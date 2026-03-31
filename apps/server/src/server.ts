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
    (origin) => new RegExp(origin, "u"),
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
app.use(
  "/swagger",
  express.static(
    path.join(import.meta.dirname, "../node_modules/swagger-ui-dist"),
    {
      index: false,
    },
  ),
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

// TODO: remove — temporary debug endpoint for auth investigation
app.get("/debug-auth", async (_req, res) => {
  const token = _req.headers.authorization?.split(" ")[1];
  if (!token) return res.json({ error: "no token" });

  const jwt = await import("jsonwebtoken");
  const jwksClient = await import("jwks-rsa");

  const client = jwksClient.default({
    jwksUri: env.AUTH_JWKS_URI,
    timeout: 5000,
  });

  const result: Record<string, unknown> = {
    authClientId: env.AUTH_CLIENT_ID,
    authIssuer: env.AUTH_ISSUER,
    jwksUri: env.AUTH_JWKS_URI,
  };

  try {
    const decoded = jwt.default.decode(token, { complete: true });
    result.tokenKid = (
      decoded?.header as unknown as Record<string, unknown>
    )?.kid;
    result.tokenAud = (decoded?.payload as Record<string, unknown>)?.aud;
    result.tokenIss = (decoded?.payload as Record<string, unknown>)?.iss;
  } catch (e) {
    result.decodeError = String(e);
  }

  try {
    const kid = (
      jwt.default.decode(token, { complete: true })
        ?.header as unknown as Record<string, unknown>
    )?.kid as string;
    const key = await client.getSigningKey(kid);
    result.jwksOk = true;
    result.keyId = key.kid;
  } catch (e) {
    result.jwksOk = false;
    result.jwksError = String(e);
  }

  await new Promise<void>((resolve) => {
    jwt.default.verify(
      token,
      (header, callback) => {
        // biome-ignore lint/style/noNonNullAssertion: debug endpoint
        client.getSigningKey(header.kid!, (err, key) => {
          if (err || !key) {
            result.verifyKeyError = String(err);
            callback(err || new Error("no key"), undefined);
            return;
          }
          callback(null, key.getPublicKey());
        });
      },
      { issuer: env.AUTH_ISSUER, audience: env.AUTH_CLIENT_ID },
      (error, decoded) => {
        if (error) {
          result.verifyError = error.message;
        } else {
          result.verifyOk = true;
          result.groups = (decoded as Record<string, unknown>)?.groups;
        }
        resolve();
      },
    );
  });

  res.json(result);
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
