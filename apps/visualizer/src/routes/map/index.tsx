import { CAMERA_BOUNDARY, INITIAL_REGION } from "@cmumaps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { FeatureVisibility, Map as MapkitMap, MapType } from "mapkit-react";
import { useRef } from "react";
import BuildingsDisplay from "@/components/map-view/building-display/BuildingsDisplay";
import OutsideNodes from "@/components/map-view/OutsideNodes";
import MyToastContainer from "@/components/shared/MyToastContainer";
import NavBar from "@/components/ui-layout/NavBar";
import env from "@/env";

export const Route = createFileRoute("/map/")({
  component: OutsideMap,
});

function OutsideMap() {
  const mapRef = useRef<mapkit.Map | null>(null);

  return (
    <>
      <NavBar floorCode="Outside" />
      <div className="relative h-dvh">
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
          paddingBottom={0}
          paddingLeft={4}
          paddingRight={4}
          paddingTop={10}
          showsZoomControl={true}
          showsCompass={FeatureVisibility.Visible}
          allowWheelToZoom
        >
          <BuildingsDisplay />
          <OutsideNodes mapRef={mapRef} />
        </MapkitMap>
      </div>
      <MyToastContainer />
    </>
  );
}
