import { Building } from "@cmumaps/common";
import { CoordinateRegion } from "mapkit-react";

import { RefObject, useState } from "react";

import {
  THRESHOLD_DENSITY_TO_SHOW_FLOORS,
  INITIAL_REGION,
  THRESHOLD_DENSITY_TO_SHOW_ROOMS,
} from "@/components/map-display/MapConstants";
import useMapPosition from "@/hooks/useMapPosition";
import { useGetBuildingsQuery } from "@/store/features/api/apiSlice";
import { setInfoCardStatus, CardStates } from "@/store/features/cardSlice";
import {
  focusFloor,
  setShowRoomNames,
  unfocusFloor,
} from "@/store/features/mapSlice";
import { showLogin } from "@/store/features/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getFloorByOrdinal, getFloorOrdinal } from "@/utils/floorUtils";
import { isInPolygon } from "@/utils/geometry";

const useMapRegionChange = (mapRef: RefObject<mapkit.Map | null>) => {
  const dispatch = useAppDispatch();

  const { data: buildings } = useGetBuildingsQuery();
  const focusedFloor = useAppSelector((state) => state.map.focusedFloor);

  const [showFloor, setShowFloor] = useState<boolean>(false);

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

      dispatch(focusFloor(focusedFloor));
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
        dispatch(focusFloor(newFocusedFloor));
      }
    }
  };

  const { onRegionChangeStart, onRegionChangeEnd } = useMapPosition(
    (region, density) => {
      dispatch(setInfoCardStatus(CardStates.COLLAPSED));

      const showFloor = density >= THRESHOLD_DENSITY_TO_SHOW_FLOORS;
      setShowFloor(showFloor);
      dispatch(setShowRoomNames(density >= THRESHOLD_DENSITY_TO_SHOW_ROOMS));

      if (showFloor && !sessionStorage.getItem("showedLogin")) {
        sessionStorage.setItem("showedLogin", "true");
        dispatch(showLogin());
      }

      if (!showFloor) {
        dispatch(unfocusFloor());
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
