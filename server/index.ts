import { PrismaClient } from '@prisma/client';
import express from 'express';
import buildingRoutes from './routes/buildingRoutes.ts';
import { notFoundHandler } from './middleware/notFoundHandler.ts';

export const prisma = new PrismaClient();
const app = express();
const port = 80;

// Routes
app.use('/api/buildings', buildingRoutes);
app.use(notFoundHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
