import express from "express";
import { buildingController } from "../controllers/buildingController.ts";

const buildingRouter = express.Router();

buildingRouter.get(
  "/codes-and-names",
  buildingController.getBuildingCodesAndNames
);
buildingRouter.get("/:id/name", buildingController.getBuildingName);
buildingRouter.get("/:id/defaultFloor", buildingController.getDefaultFloor);
buildingRouter.get("/:id/floors", buildingController.getBuildingFloors);

export default buildingRouter;
