import { create } from "zustand";
import { type BuildingSlice, createBuildingSlice } from "./buildingSlice";
import { type CardSlice, createCardSlice } from "./cardSlice";
import { createFloorSlice, type FloorSlice } from "./floorSlice";
import { createLoginSlice, type LoginSlice } from "./loginSlice";
import { createNavSlice, type NavSlice } from "./navSlice";
import { createSearchSlice, type SearchSlice } from "./searchSlice";
import { createZoomSlice, type ZoomSlice } from "./zoomSlice";

export type BoundStore = BuildingSlice &
  CardSlice &
  FloorSlice &
  LoginSlice &
  SearchSlice &
  ZoomSlice &
  NavSlice;

const useBoundStore = create<BoundStore>()((...args) => ({
  ...createFloorSlice(...args),
  ...createBuildingSlice(...args),
  ...createCardSlice(...args),
  ...createLoginSlice(...args),
  ...createSearchSlice(...args),
  ...createZoomSlice(...args),
  ...createNavSlice(...args),
}));

export default useBoundStore;
