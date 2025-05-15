import { Router } from "express";

import { populateTableController } from "../controllers/populateTableController";

const populateTableRoutes = Router();

populateTableRoutes.post(
  "/buildings",
  populateTableController.populateBuildings,
);
populateTableRoutes.post("/floors", populateTableController.populateFloors);

export default populateTableRoutes;
