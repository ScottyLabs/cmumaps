import { getBuildingsQueryOptions } from "@/api/apiClient";
import {
  INITIAL_REGION,
  THRESHOLD_DENSITY_TO_SHOW_FLOORS,
  THRESHOLD_DENSITY_TO_SHOW_ROOMS,
} from "@/components/map-display/MapConstants";
import useMapPosition from "@/hooks/useMapPosition";
import useBoundStore from "@/store";
import { getFloorByOrdinal, getFloorOrdinal } from "@/utils/floorUtils";
import { isInPolygon } from "@/utils/geometry";
import type { Building } from "@cmumaps/common";
import { useQuery } from "@tanstack/react-query";
import type { CoordinateRegion } from "mapkit-react";
import { type RefObject, useState } from "react";

const useMapRegionChange = (mapRef: RefObject<mapkit.Map | null>) => {
  // Query data
  const { data: buildings } = useQuery(getBuildingsQueryOptions());

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

    // if no floor is focused
    //   - we focus on the floor of the selected room if there is one
    //     and it is in the center building
    //   - otherwise we focus on the default floor of the center building
    if (!focusedFloor) {
      // TODO: complete when there is a selected room
      //   if (selectedRoom) {
      //     if (selectedRoom.floor.buildingCode == centerBuilding.code) {
      //       dispatch(setFocusedFloor(selectedRoom.floor));
      //       return;
      //     }
      //   }

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
