import express from 'express';
import { nodeController } from '../controllers/nodeController.ts';

const nodeRouter = express.Router();

nodeRouter.get('/', nodeController.getFloorNodes);

export default nodeRouter;
