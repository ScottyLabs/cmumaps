import type { Building } from "@cmumaps/common";
import type { CoordinateRegion } from "mapkit-react";
import { type RefObject, useState } from "react";
import $api from "@/api/client";
import {
  INITIAL_REGION,
  THRESHOLD_DENSITY_TO_SHOW_FLOORS,
  THRESHOLD_DENSITY_TO_SHOW_ROOMS,
} from "@/components/map-display/MapConstants";
import useMapPosition from "@/hooks/useMapPosition";
import useBoundStore from "@/store";
import {
  getFloorByOrdinal,
  getFloorLevelFromRoomName,
  getFloorOrdinal,
} from "@/utils/floorUtils";
import { isInPolygon } from "@/utils/geometry";

const useMapRegionChange = (mapRef: RefObject<mapkit.Map | null>) => {
  // Query data
  const { data: buildings } = $api.useQuery("get", "/buildings");

  // Global state
  const focusedFloor = useBoundStore((state) => state.focusedFloor);
  const focusFloor = useBoundStore((state) => state.focusFloor);
  const unfocusFloor = useBoundStore((state) => state.unfocusFloor);
  const showLogin = useBoundStore((state) => state.showLogin);
  const setShowRoomNames = useBoundStore((state) => state.setShowRoomNames);

  // Local state
  const [showFloor, setShowFloor] = useState<boolean>(false);

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

    // If the focused floor is in the same building as the selected floor (given by the URL params),
    // then focus the selected floor
    // HACK: use window to get current pathname value (values from hooks are stale)
    const path = window.location.pathname;
    // TODO: replace logic with a util function once urlparam branch is merged in
    const [selectedBuildingCode, roomName] =
      path.split("/")?.[1]?.split("-") || [];
    const selectedFloor = getFloorLevelFromRoomName(roomName);

    if (selectedFloor) {
      if (
        !focusedFloor ||
        (focusedFloor.buildingCode !== centerBuilding.code &&
          selectedBuildingCode === centerBuilding.code &&
          selectedFloor !== focusedFloor?.level)
      ) {
        focusFloor({
          buildingCode: centerBuilding.code,
          level: selectedFloor,
        });
        return;
      }
    }

    // if no floor is focused
    //   - we focus on the floor of the selected room if there is one
    //     and it is in the center building
    //   - otherwise we focus on the default floor of the center building
    if (!focusedFloor) {
      if (!centerBuilding.defaultFloor) {
        return;
      }

      const focusedFloor = {
        buildingCode: centerBuilding.code,
        level: centerBuilding.defaultFloor,
      };

      focusFloor(focusedFloor);
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
