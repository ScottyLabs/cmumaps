import { extractBuildingCode, type Placement } from "@cmumaps/common";
import { CAMERA_BOUNDARY, INITIAL_REGION } from "@cmumaps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { FeatureVisibility, Map as MapkitMap, MapType } from "mapkit-react";
import { useEffect, useState } from "react";
import NavBar from "@/components/ui-layout/NavBar";
import BuildingShape from "../../components/map-view/BuildingShape";
import FloorplanOverlay from "../../components/map-view/FloorplanOverlay";
import PlacementPanel from "../../components/map-view/PlacementPanel";
import ViewSwitch from "../../components/ui-layout/ViewSwitch";
import env from "../../env";
import { useGetBuildingQuery } from "../../store/api/buildingApiSlice";
import { useGetFloorPlacementQuery } from "../../store/api/floorDataApiSlice";

export const Route = createFileRoute("/map/$floorCode")({
  component: MapView,
});

function MapView() {
  const { floorCode } = Route.useParams();
  const buildingCode = extractBuildingCode(floorCode);
  const { data: building } = useGetBuildingQuery(buildingCode);
  const { data: initialPlacement } = useGetFloorPlacementQuery(floorCode);
  const [placement, setPlacement] = useState<Placement | undefined>(
    initialPlacement,
  );

  useEffect(() => {
    setPlacement(initialPlacement);
  }, [initialPlacement]);

  if (!placement) {
    return null;
  }

  return (
    <>
      <NavBar floorCode={floorCode} />
      <ViewSwitch floorCode={floorCode} />
      <div className="relative h-dvh">
        <MapkitMap
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
        >
          <PlacementPanel placement={placement} setPlacement={setPlacement} />
          <BuildingShape building={building} />
          <FloorplanOverlay floorCode={floorCode} placement={placement} />
        </MapkitMap>
      </div>
    </>
  );
}
