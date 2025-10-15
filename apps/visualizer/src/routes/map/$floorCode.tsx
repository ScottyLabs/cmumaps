import { extractBuildingCode } from "@cmumaps/common";
import { createFileRoute } from "@tanstack/react-router";
import { FeatureVisibility, Map as MapkitMap, MapType } from "mapkit-react";
import BuildingDisplay from "../../components/map-view/BuildingDisplay";
import env from "../../env";
import { useGetBuildingQuery } from "../../store/api/buildingApiSlice";

export const Route = createFileRoute("/map/$floorCode")({
  component: MapView,
});

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

function MapView() {
  const { floorCode } = Route.useParams();
  const buildingCode = extractBuildingCode(floorCode);
  console.log(buildingCode);
  const { data: building } = useGetBuildingQuery(buildingCode);
  console.log(building);

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
        <BuildingDisplay building={building} />
      </MapkitMap>
    </main>
  );
}
