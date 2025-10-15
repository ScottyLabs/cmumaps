import { CAMERA_BOUNDARY, INITIAL_REGION } from "@cmumaps/ui";
import {
  FeatureVisibility,
  type MapInteractionEvent,
  Map as MapkitMap,
  MapType,
} from "mapkit-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import $api from "@/api/client";
import BuildingsDisplay from "@/components/map-display/buildings-display/BuildingsDisplay";
import FloorPlansOverlay from "@/components/map-display/floorplans-overlay/FloorplansOverlay";
import env from "@/env";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import useMapRegionChange from "@/hooks/useMapRegionChange";
import useNavigateLocationParams from "@/hooks/useNavigateLocationParams";
import useNavigationParams from "@/hooks/useNavigationParams";
import useBoundStore from "@/store";
import { isInPolygon } from "@/utils/geometry";
import prefersReducedMotion from "@/utils/prefersReducedMotion";
import { zoomOnObject } from "@/utils/zoomUtils";
import NavLine from "../nav/NavLine";
import CoordinatePin from "./coordinate-pin/CoordinatePin";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const MapDisplay = ({ mapRef }: Props) => {
  // Query data
  const { data: buildings } = $api.useQuery("get", "/buildings");

  // Global state
  const hideSearch = useBoundStore((state) => state.hideSearch);
  const selectBuilding = useBoundStore((state) => state.selectBuilding);
  const deselectBuilding = useBoundStore((state) => state.deselectBuilding);
  const setIsZooming = useBoundStore((state) => state.setIsZooming);
  const queuedZoomRegion = useBoundStore((state) => state.queuedZoomRegion);
  const setQueuedZoomRegion = useBoundStore(
    (state) => state.setQueuedZoomRegion,
  );
  const isNavigating = useBoundStore((state) => state.isNavigating);
  const focusedFloor = useBoundStore((state) => state.focusedFloor);

  // Local state
  const isMobile = useIsMobile();
  const [usedPanning, setUsedPanning] = useState<boolean>(false);

  // Custom hooks
  const { onRegionChangeStart, onRegionChangeEnd, showFloor } =
    useMapRegionChange(mapRef);
  const navigate = useNavigateLocationParams();
  const { setSrc, setDst, isNavOpen } = useNavigationParams();
  const { buildingCode, roomName, error } = useLocationParams();

  // Toast initial error when location params are invalid
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  //Zoom on url param building/room location
  // biome-ignore lint/correctness/useExhaustiveDependencies: Should only fire on page load
  useEffect(() => {
    if (!mapRef.current) return;
    if (buildingCode) {
      const building = buildings?.[buildingCode];
      if (!building?.shape) return;
      zoomOnObject(mapRef.current, building?.shape.flat(), setIsZooming);
    }
  }, [!!mapRef.current]);

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

    // If no building is clicked,
    // If there is a sleceted room: navigate to the building containing the room
    // Otherwise: deselect the building and navigate to the home page
    if (!clickedBuilding) {
      if (isNavOpen && !isNavigating) {
        navigate(`/${buildingCode}`);
        setSrc(null);
        setDst(null);
      } else if (roomName && focusedFloor) {
        navigate(`/${buildingCode}`);
      } else {
        deselectBuilding();
        navigate("/");
      }
    }
  };

  const handleLongPress = (e: MapInteractionEvent) => {
    const coord = e.toCoordinates();
    if (isNavOpen) {
      setDst(`${coord.latitude},${coord.longitude}`);
    }
    navigate(`/${coord.latitude},${coord.longitude}`);
  };

  return (
    <MapkitMap
      ref={mapRef}
      token={env.VITE_MAPKIT_TOKEN || ""}
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
      onLongPress={handleLongPress}
      onRegionChangeStart={onRegionChangeStart}
      onRegionChangeEnd={() => {
        if (queuedZoomRegion) {
          mapRef.current?.setRegionAnimated(
            queuedZoomRegion,
            !prefersReducedMotion(),
          );
          setQueuedZoomRegion(null);
          setIsZooming(true);
        } else {
          setIsZooming(false);
        }
        onRegionChangeEnd();
      }}
    >
      <BuildingsDisplay map={mapRef.current} buildings={buildings} />
      <FloorPlansOverlay />
      <NavLine map={mapRef.current} />
      <CoordinatePin map={mapRef.current} />
    </MapkitMap>
  );
};

export default MapDisplay;
