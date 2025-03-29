import {
  Map,
  MapType,
  FeatureVisibility,
  MapInteractionEvent,
} from "mapkit-react";

import { useRef, useState } from "react";
import { useNavigate } from "react-router";

import {
  CAMERA_BOUNDARY,
  INITIAL_REGION,
  THRESHOLD_DENSITY_TO_SHOW_FLOORS,
} from "@/components/map-display/MapConstants";
import BuildingsDisplay from "@/components/map-display/buildings-display/BuildingsDisplay";
import useMapPosition from "@/hooks/useMapPosition";
import { useGetBuildingsQuery } from "@/store/features/api/apiSlice";
import { deselectBuilding, selectBuilding } from "@/store/features/mapSlice";
import { showLogin } from "@/store/features/uiSlice";
import { useAppDispatch } from "@/store/hooks";
import { isInPolygonCoordinates } from "@/utils/geometry";

const MapDisplay = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: buildings } = useGetBuildingsQuery();

  const mapRef = useRef<mapkit.Map | null>(null);
  const [usedPanning, setUsedPanning] = useState<boolean>(false);
  const [showFloor, setShowFloor] = useState<boolean>(false);

  // React to pan/zoom events
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

  const handleLoad = () => {
    if (mapRef.current) {
      mapRef.current.addEventListener("scroll-end", () => {
        setUsedPanning(true);
      });
    }
  };

  const handleClick = (e: MapInteractionEvent) => {
    if (!buildings) {
      return;
    }

    // skip if usedPanning is true since end of panning is a click
    if (usedPanning) {
      setUsedPanning(false);
      return;
    }

    // check if a building is clicked
    let clickedBuilding = false;
    if (!showFloor) {
      const coords = e.toCoordinates();

      for (const building of buildings) {
        if (
          building.shape[0] &&
          isInPolygonCoordinates(coords, building.shape[0])
        ) {
          dispatch(selectBuilding(building));
          clickedBuilding = true;
          break;
        }
      }
    }

    if (!clickedBuilding) {
      dispatch(deselectBuilding());
      navigate("/");
    }
  };

  return (
    <Map
      ref={mapRef}
      token={import.meta.env.VITE_MAPKIT_TOKEN || ""}
      initialRegion={INITIAL_REGION}
      includedPOICategories={[]}
      cameraBoundary={CAMERA_BOUNDARY}
      minCameraDistance={5}
      maxCameraDistance={1500}
      showsUserLocationControl
      showsUserLocation={true}
      mapType={MapType.MutedStandard}
      // paddingBottom={isMobile ? 72 : 0}
      paddingBottom={0}
      paddingLeft={4}
      paddingRight={4}
      paddingTop={10}
      // showsZoomControl={!isMobile}
      showsCompass={FeatureVisibility.Visible}
      allowWheelToZoom
      onLoad={handleLoad}
      onClick={handleClick}
      onRegionChangeStart={onRegionChangeStart}
      onRegionChangeEnd={() => {
        // dispatch(setIsZooming(false));
        onRegionChangeEnd();
      }}
    >
      <BuildingsDisplay buildings={buildings} />
    </Map>
  );
};

export default MapDisplay;
