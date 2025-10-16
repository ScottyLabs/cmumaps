import { CAMERA_BOUNDARY, INITIAL_REGION } from "@cmumaps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { FeatureVisibility, Map as MapkitMap, MapType } from "mapkit-react";
import BuildingsDisplay from "@/components/map-view/building-display/BuildingsDisplay";
import NavBar from "@/components/ui-layout/NavBar";
import env from "@/env";

export const Route = createFileRoute("/map/")({
  component: OutsideMap,
});

function OutsideMap() {
  return (
    <>
      <NavBar floorCode="Outside" />
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
          <BuildingsDisplay />
        </MapkitMap>
      </div>
    </>
  );
}
