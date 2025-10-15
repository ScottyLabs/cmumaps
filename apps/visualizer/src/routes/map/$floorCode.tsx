import { extractBuildingCode } from "@cmumaps/common";
import { CAMERA_BOUNDARY, INITIAL_REGION } from "@cmumaps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { FeatureVisibility, Map as MapkitMap, MapType } from "mapkit-react";
import BuildingShape from "../../components/map-view/BuildingShape";
import FloorplanOverlay from "../../components/map-view/FloorplanOverlay";
import env from "../../env";
import { useGetBuildingQuery } from "../../store/api/buildingApiSlice";

export const Route = createFileRoute("/map/$floorCode")({
  component: MapView,
});

function MapView() {
  const { floorCode } = Route.useParams();
  const buildingCode = extractBuildingCode(floorCode);
  const { data: building } = useGetBuildingQuery(buildingCode);

  return (
    <main className="relative h-dvh">
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
        <FloorplanOverlay floorCode={floorCode} />
        <BuildingShape building={building} />
      </MapkitMap>
    </main>
  );
}
