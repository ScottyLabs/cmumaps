import { Map, MapType, FeatureVisibility } from "mapkit-react";

import { useRef } from "react";

import { useGetBuildingInfosQuery } from "@/store/features/api/apiSlice";

// CMU Campus
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

const MapDisplay = () => {
  const mapRef = useRef<mapkit.Map | null>(null);

  const { data: buildingInfos } = useGetBuildingInfosQuery();

  console.log(buildingInfos);

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
      // showsZoomControl={!isMobile}
      showsCompass={FeatureVisibility.Visible}
      allowWheelToZoom
      // onRegionChangeStart={onRegionChangeStart}
      // onRegionChangeEnd={() => {
      //   dispatch(setIsZooming(false));
      //   onRegionChangeEnd();
      // }}
      // onClick={handleClick}
      // onLoad={handleLoad}
    />
  );
};

export default MapDisplay;
