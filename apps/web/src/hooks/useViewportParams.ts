import type { CoordinateRegion } from "mapkit-react";
import { parseAsFloat, useQueryStates } from "nuqs";
import type { RefObject } from "react";

const DECIMALS = 6;

const round = (n: number) => {
  const f = 10 ** DECIMALS;
  return Math.round(n * f) / f;
};

const useViewportParams = (mapRef: RefObject<mapkit.Map | null>) => {
  const [params, setParams] = useQueryStates(
    {
      lat: parseAsFloat,
      lng: parseAsFloat,
      latd: parseAsFloat,
      lngd: parseAsFloat,
    },
    { history: "replace", throttleMs: 300 },
  );

  const initialRegion: CoordinateRegion | null =
    params.lat !== null &&
    params.lng !== null &&
    params.latd !== null &&
    params.lngd !== null
      ? {
          centerLatitude: params.lat,
          centerLongitude: params.lng,
          latitudeDelta: params.latd,
          longitudeDelta: params.lngd,
        }
      : null;

  const writeViewport = () => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    const { region } = map;
    setParams({
      lat: round(region.center.latitude),
      lng: round(region.center.longitude),
      latd: round(region.span.latitudeDelta),
      lngd: round(region.span.longitudeDelta),
    });
  };

  return { initialRegion, writeViewport };
};

export { useViewportParams };
