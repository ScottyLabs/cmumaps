import type { CoordinateRegion } from "mapkit-react";
import { parseAsFloat, useQueryStates } from "nuqs";
import { type RefObject, useEffect } from "react";
import { prefersReducedMotion } from "@/utils/prefersReducedMotion";

const DECIMALS = 6;
const EPSILON = 10 ** -DECIMALS;

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

  // url -> map: react to external param changes after mount
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !initialRegion) {
      return;
    }
    const { region } = map;
    if (
      Math.abs(region.center.latitude - initialRegion.centerLatitude) <
        EPSILON &&
      Math.abs(region.center.longitude - initialRegion.centerLongitude) <
        EPSILON &&
      Math.abs(region.span.latitudeDelta - initialRegion.latitudeDelta) <
        EPSILON &&
      Math.abs(region.span.longitudeDelta - initialRegion.longitudeDelta) <
        EPSILON
    ) {
      return;
    }
    const target = new mapkit.CoordinateRegion(
      new mapkit.Coordinate(
        initialRegion.centerLatitude,
        initialRegion.centerLongitude,
      ),
      new mapkit.CoordinateSpan(
        initialRegion.latitudeDelta,
        initialRegion.longitudeDelta,
      ),
    );
    map.setRegionAnimated(target, !prefersReducedMotion());
  }, [
    mapRef,
    initialRegion,
  ]);

  return { initialRegion, writeViewport };
};

export { useViewportParams };
