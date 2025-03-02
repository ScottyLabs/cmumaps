import express from 'express';
import { buildingController } from '../controllers/buildingController.ts';

const buildingRouter = express.Router();

buildingRouter.get('/codes', buildingController.getBuildingCodes);

export default buildingRouter;
