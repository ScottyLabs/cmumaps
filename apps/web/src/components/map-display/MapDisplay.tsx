import {
  Map,
  MapType,
  FeatureVisibility,
  MapInteractionEvent,
} from "mapkit-react";

import { useState } from "react";
import { useNavigate } from "react-router";

import BuggyPath from "@/components/carnival/buggy/BuggyPath";
import {
  CAMERA_BOUNDARY,
  INITIAL_REGION,
} from "@/components/map-display/MapConstants";
import BuildingsDisplay from "@/components/map-display/buildings-display/BuildingsDisplay";
import FloorPlansOverlay from "@/components/map-display/floorplans-overlay/FloorplansOverlay";
import useIsMobile from "@/hooks/useIsMobile";
import useMapRegionChange from "@/hooks/useMapRegionChange";
import { useGetBuildingsQuery } from "@/store/features/api/apiSlice";
import {
  deselectBuilding,
  selectBuilding,
  setIsZooming,
} from "@/store/features/mapSlice";
import { setIsSearchOpen } from "@/store/features/uiSlice";
import { useAppDispatch } from "@/store/hooks";
import { isInPolygon } from "@/utils/geometry";

import EventPin from "./events/EventPin";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const MapDisplay = ({ mapRef }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: buildings } = useGetBuildingsQuery();

  const [usedPanning, setUsedPanning] = useState<boolean>(false);

  const { onRegionChangeStart, onRegionChangeEnd, showFloor } =
    useMapRegionChange(mapRef);

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

    // close search when clicking on the map
    dispatch(setIsSearchOpen(false));

    // check if a building is clicked
    let clickedBuilding = false;
    if (!showFloor) {
      const coords = e.toCoordinates();

      for (const buildingCode in buildings) {
        const building = buildings[buildingCode];
        if (building?.shape[0] && isInPolygon(coords, building.shape[0])) {
          if (building) {
            dispatch(selectBuilding(building));
            clickedBuilding = true;
          }
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
      showsZoomControl={!isMobile}
      showsCompass={FeatureVisibility.Visible}
      allowWheelToZoom
      onLoad={handleLoad}
      onClick={handleClick}
      onRegionChangeStart={onRegionChangeStart}
      onRegionChangeEnd={() => {
        dispatch(setIsZooming(false));
        onRegionChangeEnd();
      }}
    >
      <BuildingsDisplay map={mapRef.current} buildings={buildings} />
      <FloorPlansOverlay />
      <BuggyPath />
      <EventPin />
    </Map>
  );
};

export default MapDisplay;
