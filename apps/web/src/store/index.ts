import { create } from "zustand";
import type { BuildingSlice } from "./buildingSlice.ts";
import { createBuildingSlice } from "./buildingSlice.ts";
import type { CardSlice } from "./cardSlice.ts";
import { createCardSlice } from "./cardSlice.ts";
import type { FloorSlice } from "./floorSlice.ts";
import { createFloorSlice } from "./floorSlice.ts";
import type { LoginSlice } from "./loginSlice.ts";
import { createLoginSlice } from "./loginSlice.ts";
import type { NavSlice } from "./navSlice.ts";
import { createNavSlice } from "./navSlice.ts";
import type { SearchSlice } from "./searchSlice.ts";
import { createSearchSlice } from "./searchSlice.ts";
import type { UserPositionSlice } from "./userPositionSlice.ts";
import { createUserPositionSlice } from "./userPositionSlice.ts";
import type { ZoomSlice } from "./zoomSlice.ts";
import { createZoomSlice } from "./zoomSlice.ts";

export type BoundStore = BuildingSlice &
  CardSlice &
  FloorSlice &
  LoginSlice &
  SearchSlice &
  ZoomSlice &
  NavSlice &
  UserPositionSlice;

const useBoundStore = create<BoundStore>()((...args) => ({
  ...createFloorSlice(...args),
  ...createBuildingSlice(...args),
  ...createCardSlice(...args),
  ...createLoginSlice(...args),
  ...createSearchSlice(...args),
  ...createZoomSlice(...args),
  ...createNavSlice(...args),
  ...createUserPositionSlice(...args),
}));

export { useBoundStore };
