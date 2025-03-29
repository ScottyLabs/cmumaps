import { RefObject, useState } from "react";

import {
  THRESHOLD_DENSITY_TO_SHOW_FLOORS,
  INITIAL_REGION,
} from "@/components/map-display/MapConstants";
import useMapPosition from "@/hooks/useMapPosition";
import { showLogin } from "@/store/features/uiSlice";
import { useAppDispatch } from "@/store/hooks";

const useMapRegionChange = (mapRef: RefObject<mapkit.Map | null>) => {
  const dispatch = useAppDispatch();
  const [showFloor, setShowFloor] = useState<boolean>(false);

  const { onRegionChangeStart, onRegionChangeEnd } = useMapPosition(
    (_region, density) => {
      const showFloor = density >= THRESHOLD_DENSITY_TO_SHOW_FLOORS;
      setShowFloor(showFloor);

      if (showFloor && !sessionStorage.getItem("showedLogin")) {
        sessionStorage.setItem("showedLogin", "true");
        dispatch(showLogin());
      }
    },
    mapRef,
    INITIAL_REGION,
  );

  return { onRegionChangeStart, onRegionChangeEnd, showFloor };
};

export default useMapRegionChange;
