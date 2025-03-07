import express from "express";
import { buildingController } from "../controllers/buildingController.ts";
import { requireAuth } from "../middleware/authMiddleware.ts";

const buildingRouter = express.Router();

buildingRouter.get(
  "/codes-and-names",
  requireAuth,
  buildingController.getBuildingCodesAndNames
);
buildingRouter.get(
  "/:id/defaultFloor",
  buildingController.getDefaultFloor as express.RequestHandler
);
buildingRouter.get(
  "/:id/floors",
  buildingController.getBuildingFloors as express.RequestHandler
);

export default buildingRouter;
