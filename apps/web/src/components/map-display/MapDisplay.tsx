import {
  Map,
  MapType,
  FeatureVisibility,
  MapInteractionEvent,
} from "mapkit-react";

import { useRef, useState } from "react";
import { useNavigate } from "react-router";

import BuildingsDisplay from "@/components/map-display/buildings-display/BuildingsDisplay";
import { useGetBuildingsQuery } from "@/store/features/api/apiSlice";
import { deselectBuilding, selectBuilding } from "@/store/features/mapUiSlice";
import { useAppDispatch } from "@/store/hooks";
import { isInPolygonCoordinates } from "@/utils/geometry";

// CMU Campus
const INITIAL_REGION = {
  centerLatitude: 40.444,
  centerLongitude: -79.945,
  latitudeDelta: 0.006337455593801167,
  longitudeDelta: 0.011960061265583022,
};

const CAMERA_BOUNDARY = {
  centerLatitude: 40.44533940432823,
  centerLongitude: -79.9457060010195,
  latitudeDelta: 0.009258427149788417,
  longitudeDelta: 0.014410141520116326,
};

const MapDisplay = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: buildings } = useGetBuildingsQuery();

  const mapRef = useRef<mapkit.Map | null>(null);
  const [usedPanning, setUsedPanning] = useState<boolean>(false);
  const [showFloor, _setShowFloor] = useState<boolean>(false);

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
      // onRegionChangeStart={onRegionChangeStart}
      // onRegionChangeEnd={() => {
      //   dispatch(setIsZooming(false));
      //   onRegionChangeEnd();
      // }}
    >
      <BuildingsDisplay buildings={buildings} />
    </Map>
  );
};

export default MapDisplay;
