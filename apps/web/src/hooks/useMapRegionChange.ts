import type { Building } from "@cmumaps/common";
import { INITIAL_REGION } from "@cmumaps/ui";
import type { CoordinateRegion } from "mapkit-react";
import { type RefObject, useState } from "react";
import $api from "@/api/client";
import {
  THRESHOLD_DENSITY_TO_SHOW_FLOORS,
  THRESHOLD_DENSITY_TO_SHOW_ROOMS,
} from "@/components/map-display/mapConstants";
import useMapPosition from "@/hooks/useMapPosition";
import useBoundStore from "@/store";
import {
  getFloorByOrdinal,
  getFloorLevelFromRoomName,
  getFloorOrdinal,
} from "@/utils/floorUtils";
import { isInPolygon } from "@/utils/geometry";
import useNavigationParams from "./useNavigationParams";

const useMapRegionChange = (mapRef: RefObject<mapkit.Map | null>) => {
  // Query data
  const { data: buildings } = $api.useQuery("get", "/buildings");

  // Global state
  const focusedFloor = useBoundStore((state) => state.focusedFloor);
  const focusFloor = useBoundStore((state) => state.focusFloor);
  const unfocusFloor = useBoundStore((state) => state.unfocusFloor);
  const showLogin = useBoundStore((state) => state.showLogin);
  const setShowRoomNames = useBoundStore((state) => state.setShowRoomNames);
  const instructionIndex = useBoundStore((state) => state.navInstructionIndex);
  const isNavigating = useBoundStore((state) => state.isNavigating);
  const selectedPath = useBoundStore((state) => state.selectedPath);

  // Local state
  const [showFloor, setShowFloor] = useState<boolean>(false);

  const { navPaths } = useNavigationParams();
  const instructions = useBoundStore((state) => state.navInstructions) ?? [];

  // Calculates the focused floor based on the region
  const calcFocusedFloor = (region: CoordinateRegion) => {
    if (!buildings) {
      return;
    }

    const center = {
      latitude: region.centerLatitude,
      longitude: region.centerLongitude,
    };

    const centerBuilding =
      Object.values(buildings).find(
        (building: Building) =>
          building.shape && isInPolygon(center, building.shape.flat(2)),
      ) ?? null;

    if (!centerBuilding) {
      return;
    }

    // if no floor is focused or the focused floor is not in the center building
    //   - we focus on the floor of the selected room if there is one
    //     and it is in the center building
    //   - otherwise we focus on the default floor of the center building
    if (!focusedFloor || focusedFloor.buildingCode !== centerBuilding.code) {
      // If actively navigating, focus on the floor corresponding to the current instruction
      // if it is in the focused building
      if (isNavigating) {
        const node =
          instructionIndex === 0
            ? navPaths?.[selectedPath]?.path.path[0]
            : navPaths?.[selectedPath]?.path.path.find(
                (n) => n.id === instructions[instructionIndex - 1]?.node_id,
              );
        if (node?.floor && node.floor.buildingCode === centerBuilding.code) {
          focusFloor(node.floor);
          return;
        }
      }

      // If the focused floor is in the same building as the selected floor (given by the URL params),
      // then focus the selected floor
      const path = window.location.pathname;
      const [selectedBuildingCode, roomName] =
        path.split("/")?.[1]?.split("-") || [];
      const selectedFloor = getFloorLevelFromRoomName(roomName);

      if (
        selectedFloor &&
        selectedBuildingCode === centerBuilding.code &&
        selectedFloor !== focusedFloor?.level
      ) {
        focusFloor({
          buildingCode: centerBuilding.code,
          level: selectedFloor,
        });
        return;
      }

      if (!centerBuilding.defaultFloor) {
        return;
      }

      const newFocusedFloor = {
        buildingCode: centerBuilding.code,
        level: centerBuilding.defaultFloor,
      };

      focusFloor(newFocusedFloor);
      return;
    }

    // if we are focusing on a different building,
    // then focus on the floor of the center building
    // that is the same ordinal as the currently focused floor
    const focusedBuilding = buildings[focusedFloor.buildingCode];
    if (focusedBuilding && focusedBuilding.code !== centerBuilding.code) {
      const newFocusedFloor = getFloorByOrdinal(
        centerBuilding,
        getFloorOrdinal(focusedBuilding, focusedFloor),
      );

      if (newFocusedFloor) {
        focusFloor(newFocusedFloor);
      }
    }
  };

  const { onRegionChangeStart, onRegionChangeEnd } = useMapPosition(
    (region, density) => {
      // dispatch(setInfoCardStatus(CardStates.COLLAPSED));

      const showFloor = density >= THRESHOLD_DENSITY_TO_SHOW_FLOORS;
      setShowFloor(showFloor);
      setShowRoomNames(density >= THRESHOLD_DENSITY_TO_SHOW_ROOMS);

      if (showFloor && !sessionStorage.getItem("showedLogin")) {
        sessionStorage.setItem("showedLogin", "true");
        showLogin();
      }

      if (!showFloor) {
        unfocusFloor();
        return;
      }

      calcFocusedFloor(region);
    },
    mapRef,
    INITIAL_REGION,
  );

  return { onRegionChangeStart, onRegionChangeEnd, showFloor };
};

export default useMapRegionChange;
