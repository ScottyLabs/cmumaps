import type { Building, Placement } from "@cmumaps/common";
import { CAMERA_BOUNDARY, INITIAL_REGION } from "@cmumaps/ui";
import {
  FeatureVisibility,
  type MapInteractionEvent,
  Map as MapkitMap,
  MapType,
} from "mapkit-react";
import { useRef, useState } from "react";
import BuildingShape from "@/components/map-view/BuildingShape";
import CenterPin from "@/components/map-view/CenterPin";
import FloorplanOverlay from "@/components/map-view/FloorplanOverlay";
import { zoomOnBuilding } from "@/components/map-view/zoomUtils";
import env from "@/env";

interface Props {
  floorCode: string;
  building: Building;
  placement: Placement;
  setPlacement: (placement: Placement) => void;
}

const MapDisplay = ({
  floorCode,
  building,
  placement,
  setPlacement,
}: Props) => {
  const map = useRef<mapkit.Map | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="relative h-dvh">
      <MapkitMap
        ref={map}
        token={env.VITE_MAPKIT_TOKEN || ""}
        initialRegion={INITIAL_REGION}
        includedPOICategories={[]}
        cameraBoundary={CAMERA_BOUNDARY}
        minCameraDistance={5}
        maxCameraDistance={1500}
        showsUserLocationControl
        showsUserLocation={true}
        mapType={MapType.MutedStandard}
        paddingBottom={0}
        paddingLeft={4}
        paddingRight={4}
        paddingTop={10}
        showsZoomControl={true}
        showsCompass={FeatureVisibility.Visible}
        allowWheelToZoom
        onLoad={() => zoomOnBuilding(map.current, building)}
        onMouseDown={() => setIsDragging(false)}
        onMouseMove={() => setIsDragging(true)}
        onMouseUp={(e: MapInteractionEvent) => {
          if (!isDragging) {
            setPlacement({
              ...placement,
              geoCenter: e.toCoordinates(),
            });
          }
        }}
      >
        <BuildingShape building={building} />
        <FloorplanOverlay floorCode={floorCode} placement={placement} />
        <CenterPin placement={placement} />
      </MapkitMap>
    </div>
  );
};

export default MapDisplay;
