import { useQuery } from "@tanstack/react-query";
import {
  Map,
  MapType,
  FeatureVisibility,
  MapInteractionEvent,
} from "mapkit-react";

import { useState } from "react";
import { useNavigate } from "react-router";

import { getBuildingsQueryOptions } from "@/api/apiClient";
import {
  CAMERA_BOUNDARY,
  INITIAL_REGION,
} from "@/components/map-display/MapConstants";
import BuildingsDisplay from "@/components/map-display/buildings-display/BuildingsDisplay";
import FloorPlansOverlay from "@/components/map-display/floorplans-overlay/FloorplansOverlay";
import useIsMobile from "@/hooks/useIsMobile";
import useMapRegionChange from "@/hooks/useMapRegionChange";
import useMapStore from "@/store/mapSlice";
import useUiStore from "@/store/uiSlice";
import { isInPolygon } from "@/utils/geometry";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const MapDisplay = ({ mapRef }: Props) => {
  const navigate = useNavigate();

  const hideSearch = useUiStore((state) => state.hideSearch);
  const selectBuilding = useMapStore((state) => state.selectBuilding);
  const deselectBuilding = useMapStore((state) => state.deselectBuilding);
  const setIsZooming = useMapStore((state) => state.setIsZooming);

  const isMobile = useIsMobile();
  const [usedPanning, setUsedPanning] = useState<boolean>(false);
  const { onRegionChangeStart, onRegionChangeEnd, showFloor } =
    useMapRegionChange(mapRef);

  const { data: buildings } = useQuery(getBuildingsQueryOptions());

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
    hideSearch();

    // check if a building is clicked
    let clickedBuilding = false;
    if (!showFloor) {
      const coords = e.toCoordinates();

      for (const buildingCode in buildings) {
        const building = buildings[buildingCode];
        if (building?.shape[0] && isInPolygon(coords, building.shape[0])) {
          if (building) {
            selectBuilding(building);
            clickedBuilding = true;
          }
          break;
        }
      }
    }

    if (!clickedBuilding) {
      deselectBuilding();
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
        setIsZooming(false);
        onRegionChangeEnd();
      }}
    >
      <BuildingsDisplay map={mapRef.current} buildings={buildings} />
      <FloorPlansOverlay />
    </Map>
  );
};

export default MapDisplay;
