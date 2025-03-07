import express from "express";
import { buildingController } from "../controllers/buildingController.ts";
import { checkAuth } from "../middleware/authMiddleware.ts";

const buildingRouter = express.Router();

buildingRouter.get(
  "/codes-and-names",
  checkAuth,
  buildingController.getBuildingCodesAndNames
);

buildingRouter.get(
  "/:id/defaultFloor",
  checkAuth,
  buildingController.getDefaultFloor as express.RequestHandler
);

buildingRouter.get(
  "/:id/floors",
  checkAuth,
  buildingController.getBuildingFloors as express.RequestHandler
);

export default buildingRouter;
