import { PrismaClient } from '@prisma/client';
import express from 'express';
import buildingRoutes from './routes/buildingRoutes.ts';
import { notFoundHandler } from './middleware/notFoundHandler.ts';
import cors from 'cors';

export const prisma = new PrismaClient();
const app = express();
app.use(cors());

// Routes
app.use('/api/buildings', buildingRoutes);
app.use(notFoundHandler);

const port = 80;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
