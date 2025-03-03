import { PrismaClient } from "@prisma/client";
import express from "express";
import buildingRoutes from "./routes/buildingRoutes.ts";
import { notFoundHandler } from "./middleware/notFoundHandler.ts";
import cors from "cors";
import nodeRoutes from "./routes/nodeRoutes.ts";

export const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/buildings", buildingRoutes);
app.use("/api/nodes", nodeRoutes);
app.use(notFoundHandler);

const port = 80;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
