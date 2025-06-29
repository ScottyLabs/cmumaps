import { create } from "zustand";
import { type BuildingSlice, createBuildingSlice } from "./buildingSlice";
import { type CardSlice, createCardSlice } from "./cardSlice";
import { type FloorSlice, createFloorSlice } from "./floorSlice";
import { type LoginSlice, createLoginSlice } from "./loginSlice";
import { type NavSlice, createNavSlice } from "./navSlice";
import { type SearchSlice, createSearchSlice } from "./searchSlice";
import { type ZoomSlice, createZoomSlice } from "./zoomSlice";

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
