import React, { useEffect, useMemo, useState } from 'react';
import BuildingShape from '../../components/buildings/BuildingShape';
import FloorPlanOverlay, {
  getFloorCenter,
  positionOnMap,
} from '../../components/buildings/FloorPlanOverlay';
import useMapPosition from '../../hooks/useMapPosition';
import { isInPolygonCoordinates } from '../../geometry';

import {
  Coordinate,
  FeatureVisibility,
  Map,
  MapType,
  PointOfInterestCategory,
  Polyline,
} from 'mapkit-react';
import { useIsDesktop } from '@/hooks/useWindowDimensions';
import prefersReducedMotion from '@/util/prefersReducedMotion';
import {
  AbsoluteCoordinate,
  Building,
  Export,
  Floor,
  FloorMap,
  FloorPlan,
  Room,
} from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  claimRoom,
  focusBuilding,
  setIsSearchOpen,
} from '@/lib/features/uiSlice';
import { node } from '@/app/api/findPath/route';
import {
  addFloorToMap,
  setBuildings,
  setFloorMap,
  setLegacyFloorMap,
} from '@/lib/features/dataSlice';

/**
 * The JSON file at this address contains all the map data used by the project.
 */
const exportFile = 'https://nicolapps.github.io/cmumap-data-mirror/export.json';

function min(x, y) {
  return x <= y ? x : y;
}
function max(x, y) {
  return x >= y ? x : y;
}

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const MapDisplay = ({
  params,
  mapRef,
  points,
  setShowFloor,
  setShowRoomNames,
  setFloorOrdinal,
  currentFloorName,
  showBuilding,
  showFloor,
  floorOrdinal,
  showRoomNames,
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const dispatch = useAppDispatch();

  const buildings = useAppSelector((state) => state.data.buildings);
  const recommendedPath = useAppSelector((state) => state.nav.recommendedPath);
  const selectedRoom = useAppSelector((state) => state.ui.selectedRoom);
  const focusedBuilding = useAppSelector((state) => state.ui.focusedBuilding);
  const floors = useAppSelector((state) => state.data.floorMap);
  let currentBlueDot: undefined | mapkit.Overlay = undefined;

  function error(err) {
    console.error(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {
    if (!mapLoaded || !floors || Object.keys(floors).length < 10) {
      return;
    }
    const style = new mapkit.Style({
      lineWidth: 2, // 2 CSS pixels.
      strokeColor: '#999',
      fillColor: 'blue',
    });
    navigator.geolocation.watchPosition(
      (pos) => {
        if (currentBlueDot) {
          mapRef.current?.removeOverlay(currentBlueDot);
        }
        points.push([pos.coords.latitude, pos.coords.longitude]);
        const coord = new mapkit.Coordinate(
          pos.coords.latitude,
          pos.coords.longitude,
        );

        const circle = new mapkit.CircleOverlay(
          coord,
          max(min(20, pos.coords.accuracy), 30),
        );
        style.fillOpacity = min((pos.coords.altitude - 200) / 100, 0.5);
        circle.style = style;
        currentBlueDot = mapRef.current?.addOverlay(circle);
      },
      error,
      options,
    );
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          points.push([pos.coords.latitude, pos.coords.longitude]);
          const coord = new mapkit.Coordinate(
            pos.coords.latitude,
            pos.coords.longitude,
          );

          const circle = new mapkit.CircleOverlay(coord, 2);
          circle.style = style;
          mapRef.current?.addOverlay(circle);
        },
        error,
        options,
      );
    }, 500);
  }, [mapLoaded]);

  const showRoom = (
    newRoom: Room,
    newBuilding: Building | null,
    convertToMap,
    updateMap: boolean,
  ) => {
    if (newBuilding === null) {
      return;
    }

    if (updateMap) {
      const points: AbsoluteCoordinate[] = newRoom.polygon.coordinates.flat();
      const coords: Coordinate[] = points.map((p) => convertToMap(p));
      const allLat = coords.map((c) => c.latitude);
      const allLon = coords.map((c) => c.longitude);

      mapRef.current?.setRegionAnimated(
        new mapkit.BoundingRegion(
          Math.max(...allLat),
          Math.max(...allLon),
          Math.min(...allLat),
          Math.min(...allLon),
        ).toCoordinateRegion(),
        !prefersReducedMotion(),
      );
      setShowFloor(true);
      setShowRoomNames(false);
    }
  };

  const zoomOnDefaultBuilding = (
    newBuildings: Building[] | null,
    newFloors: Floor[] | null,
  ) => {
    // Make sure that both buildings and the map are loaded
    if (!newBuildings || !mapRef.current) {
      return;
    }
    const r = new RegExp('-|#');
    // Handle the URL
    const [buildingCode, floorName] = (params.slug?.[0] ?? '')
      .toUpperCase()
      .split(r);

    const roomid = params.slug?.[1];

    const building: Building | null =
      buildingCode && newBuildings.find((b) => b.code === buildingCode)!;
    if (newFloors && roomid && floorName && building) {
      const floor = building.floors.find(({ name }) => name === floorName)!;
      const floorPlan = newFloors[`${building.code}-${floor.name}`];

      const { rooms, placement } = floorPlan;
      // Compute the center position of the bounding box of the current floor
      // (Will be used as the rotation center)
      const center: AbsoluteCoordinate | undefined = getFloorCenter(rooms);
      const convertToMap = (absolute: AbsoluteCoordinate): Coordinate =>
        positionOnMap(absolute, placement, center);

      if (floor) {
        setFloorOrdinal(floor.ordinal);
      }
      if (floorPlan && roomid) {
        const room = floorPlan.rooms.find((room) => room.id === roomid);
        showRoom(room, building, convertToMap, true);
        dispatch(focusBuilding(building));
        dispatch(claimRoom(room));
      } else {
        showBuilding(building, true);
      }
    } else if (building) {
      const floor = building.floors.find(({ name }) => name === floorName)!;
      if (floor) {
        setFloorOrdinal(floor.ordinal);
      } else {
        setFloorOrdinal(0);
      }
      showBuilding(building, true);
    } else {
      // Redirect to the default page
      // window.history.pushState({}, '', window.location.pathname);
      window.history.pushState({}, '', window.location.href);
      // router.push('/', {scroll: false});
    }
  };

  // Load the data from the API
  useEffect(() => {
    fetch(exportFile) // Only use this file for the buildings
      .then((r) => r.json())
      .then((response: Export) => {
        Object.entries(response.floors).forEach(([code, floorPlan]) => {
          const rooms = floorPlan.rooms;
          // Add floor code to room objects
          rooms.forEach((room: Room) => {
            room.floor = code;
          });
        });

        const buildings = response.buildings;
        // To improve speed later, we can load the floor data only when needed --
        // but we need to load it all for now to support search
        const promises = buildings
          .map((building) =>
            building.floors.map(async (floor) => {
              if (!['GHC'].includes(building.code)) {
                return [null, null];
              }
              const outlineResp = await fetch(
                `/json/${building.code}/${building.code}-${floor.name}-outline.json`,
              );
              const outlineJson = await outlineResp.json();
              return [`${building.code}-${floor.name}`, outlineJson];
            }),
          )
          .flat(2);
        console.log(promises);
        Promise.all(promises).then((responses) => {
          console.log(responses);
          responses.forEach(([code, floorPlan]) => {
            if (code) {
              dispatch(addFloorToMap([code, floorPlan]));
            }
          });
          dispatch(setBuildings(response.buildings));
          dispatch(setLegacyFloorMap(response.floors));
          zoomOnDefaultBuilding(response.buildings, response.floors);
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // zoomOnDefaultBuilding(buildings, floors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the URL from the current floor
  useEffect(() => {
    if (!buildings) {
      return;
    }

    let url = window.location.href;
    if (focusedBuilding) {
      url += `${focusedBuilding.code}`;
    }
    if (currentFloorName) {
      url += `-${currentFloorName}`;
    }
    if (selectedRoom) {
      url += `${selectedRoom.id}`;
    }
    // window.history.pushState({}, '', url);
    window.history.pushState({}, '', url);
    // router.push(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom, focusedBuilding, currentFloorName]);

  const cameraBoundary = useMemo(
    () => ({
      centerLatitude: 40.44533940432823,
      centerLongitude: -79.9457060010195,
      latitudeDelta: 0.009258427149788417,
      longitudeDelta: 0.014410141520116326,
    }),
    [],
  );

  const initialRegion = useMemo(
    () => ({
      centerLatitude: 40.444,
      centerLongitude: -79.945,
      latitudeDelta: 0.006337455593801167,
      longitudeDelta: 0.011960061265583022,
    }),
    [],
  );

  // React to pan/zoom events
  const { onRegionChangeStart, onRegionChangeEnd } = useMapPosition(
    (region, density) => {
      if (!buildings) {
        return;
      }

      const newShowFloors = density >= 200_000;
      setShowFloor(newShowFloors);
      setShowRoomNames(density >= 750_000);

      if (newShowFloors) {
        const center = {
          latitude: region.centerLatitude,
          longitude: region.centerLongitude,
        };
        const centerBuilding =
          buildings.find(
            (building: Building) =>
              building.hitbox &&
              isInPolygonCoordinates(building.hitbox, center),
          ) ?? null;

        showBuilding(centerBuilding, false);
      } else {
        dispatch(focusBuilding(null));
        setFloorOrdinal(null);
      }
    },
    mapRef,
    initialRegion,
  );

  const isDesktop = useIsDesktop();
  return (
    <Map
      ref={mapRef}
      token={process.env.NEXT_PUBLIC_MAPKITJS_TOKEN!}
      initialRegion={initialRegion}
      includedPOICategories={[PointOfInterestCategory.Restaurant]}
      cameraBoundary={cameraBoundary}
      minCameraDistance={100}
      maxCameraDistance={1500}
      showsUserLocationControl
      mapType={MapType.MutedStandard}
      paddingBottom={isDesktop ? 0 : 72}
      paddingLeft={4}
      paddingRight={4}
      paddingTop={10}
      showsZoomControl={!!isDesktop}
      showsCompass={
        isDesktop ? FeatureVisibility.Adaptive : FeatureVisibility.Hidden
      }
      allowWheelToZoom
      onLoad={() => {
        zoomOnDefaultBuilding(buildings, null);
        setMapLoaded(true);
      }}
      onRegionChangeStart={onRegionChangeStart}
      onRegionChangeEnd={onRegionChangeEnd}
      onClick={() => dispatch(setIsSearchOpen(false))}
    >
      {recommendedPath && (
        <Polyline
          points={recommendedPath?.map((n: node) =>
            positionOnMap(
              [n.pos.x, n.pos.y],
              {
                center: {
                  latitude: 40.44367399601104,
                  longitude: -79.94452069407168,
                },
                scale: 5.85,
                angle: 254,
              },
              [332.58, 327.18],
            ),
          )}
          selected={false}
          enabled={true}
          strokeColor={'red'}
          strokeOpacity={1}
          lineWidth={5}
        ></Polyline>
      )}
      {buildings &&
        buildings.map((building) => (
          <BuildingShape
            key={building.code}
            building={building}
            showName={!showFloor}
          />
        ))}

      {showFloor &&
        buildings &&
        buildings.flatMap((building: Building) =>
          building.floors.map((floor: Floor) => {
            if (floor.ordinal !== floorOrdinal) {
              return null;
            }

            const code = `${building.code}-${floor.name}`;
            if (code.substring(0, 3) != 'GHC') {
              return null;
            }
            const floorPlan = floors[code];
            return (
              floorPlan && (
                <FloorPlanOverlay
                  key={code}
                  floorPlan={floorPlan}
                  showRoomNames={showRoomNames}
                  isBackground={building.code !== focusedBuilding?.code}
                />
              )
            );
          }),
        )}
    </Map>
  );
};

export default MapDisplay;