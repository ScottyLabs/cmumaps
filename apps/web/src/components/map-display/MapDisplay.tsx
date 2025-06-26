import { getBuildingsQueryOptions } from "@/api/apiClient";
import {
  CAMERA_BOUNDARY,
  INITIAL_REGION,
} from "@/components/map-display/MapConstants";
import BuildingsDisplay from "@/components/map-display/buildings-display/BuildingsDisplay";
import FloorPlansOverlay from "@/components/map-display/floorplans-overlay/FloorplansOverlay";
import useIsMobile from "@/hooks/useIsMobile";
import useMapRegionChange from "@/hooks/useMapRegionChange";
import useNavigateLocationParams from "@/hooks/useNavigateLocationParams";
import useBoundStore from "@/store";
import { isInPolygon } from "@/utils/geometry";
import { useQuery } from "@tanstack/react-query";
import {
  FeatureVisibility,
  type MapInteractionEvent,
  MapType,
  Map as MapkitMap,
} from "mapkit-react";
import { useQueryState } from "nuqs";
import { useState } from "react";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const MapDisplay = ({ mapRef }: Props) => {
  // Library hooks
  const navigate = useNavigateLocationParams();

  // Query data
  const { data: buildings } = useQuery(getBuildingsQueryOptions());

  // Global state
  const hideSearch = useBoundStore((state) => state.hideSearch);
  const selectBuilding = useBoundStore((state) => state.selectBuilding);
  const deselectBuilding = useBoundStore((state) => state.deselectBuilding);
  const setIsZooming = useBoundStore((state) => state.setIsZooming);

  // Local state
  const isMobile = useIsMobile();
  const [usedPanning, setUsedPanning] = useState<boolean>(false);

  // Custom hooks
  const { onRegionChangeStart, onRegionChangeEnd, showFloor } =
    useMapRegionChange(mapRef);

  const [src, setSrc] = useQueryState("src");
  const [dst, setDst] = useQueryState("dst");

  // Need to keep track of usedPanning because the end of panning is a click
  // and we don't want to trigger a click when the user is panning
  const handleLoad = () => {
    if (mapRef.current) {
      mapRef.current.addEventListener("scroll-end", () => setUsedPanning(true));
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

    // If no building is clicked, deselect the building and navigate to the home page
    // TODO: do we need to deselect the room?
    if (!clickedBuilding) {
      deselectBuilding();
      navigate("/");
      setSrc(null);
      setDst(null);
    }
  };

  return (
    <MapkitMap
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
    </MapkitMap>
  );
};

export default MapDisplay;
