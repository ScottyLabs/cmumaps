import { create } from "zustand";

import { createBuildingSlice, BuildingSlice } from "./buildingSlice";
import { createCardSlice, CardSlice } from "./cardSlice";
import { createFloorSlice, FloorSlice } from "./floorSlice";
import { createLoginSlice, LoginSlice } from "./loginSlice";
import { createSearchSlice, SearchSlice } from "./searchSlice";
import { createZoomSlice, ZoomSlice } from "./zoomSlice";

export type BoundStore = BuildingSlice &
  CardSlice &
  FloorSlice &
  LoginSlice &
  SearchSlice &
  ZoomSlice;

const useBoundStore = create<BoundStore>()((...args) => ({
  ...createFloorSlice(...args),
  ...createBuildingSlice(...args),
  ...createCardSlice(...args),
  ...createLoginSlice(...args),
  ...createSearchSlice(...args),
  ...createZoomSlice(...args),
}));

export default useBoundStore;
