import { throttle } from 'lodash';
import {
  Coordinate,
  FeatureVisibility,
  Map,
  MapType,
  CoordinateRegion,
  Annotation,
  MapInteractionEvent,
} from 'mapkit-react';

import React, { useEffect, useState } from 'react';

import {
  setChoosingRoomMode,
  setEndLocation,
  setStartLocation,
} from '@/lib/features/navSlice';
import {
  deselectBuilding,
  deselectRoom,
  selectBuilding,
  setFocusedFloor,
  setCardWrapperStatus,
  setIsSearchOpen,
  setIsZooming,
  setShowRoomNames,
  COLLAPSED,
} from '@/lib/features/uiSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Building } from '@/types';
import { isInPolygonCoordinates } from '@/util/geometry';

import useMapPosition from '../../hooks/useMapPosition';
import NavLine from '../navigation/NavLine';
import EventPin from '../shared/EventPin';
import RoomPin from '../shared/RoomPin';
import BuildingShape from './BuildingShape';
import FloorPlanOverlay, {
  getFloorAtOrdinal,
  getOrdinalOfFloor,
} from './FloorPlanOverlay';
import { zoomOnRoom } from './mapUtils';

//#region Constants
const THRESHOLD_DENSITY_TO_SHOW_FLOORS = 350_000;
const THRESHOLD_DENSITY_TO_SHOW_ROOMS = 750_000;

const cameraBoundary = {
  centerLatitude: 40.44533940432823,
  centerLongitude: -79.9457060010195,
  latitudeDelta: 0.009258427149788417,
  longitudeDelta: 0.014410141520116326,
};

export const initialRegion = {
  centerLatitude: 40.444,
  centerLongitude: -79.945,
  latitudeDelta: 0.006337455593801167,
  longitudeDelta: 0.011960061265583022,
};
//#endregion

interface MapDisplayProps {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const MapDisplay = ({ mapRef }: MapDisplayProps) => {
  const dispatch = useAppDispatch();

  const buildings = useAppSelector((state) => state.data.buildings);
  const focusedFloor = useAppSelector((state) => state.ui.focusedFloor);
  const selectedRoom = useAppSelector((state) => state.ui.selectedRoom);
  const isMobile = useAppSelector((state) => state.ui.isMobile);
  const choosingRoomMode = useAppSelector(
    (state) => state.nav.choosingRoomMode,
  );
  const isNavOpen = useAppSelector((state) => state.nav.isNavOpen);
  const isZooming = useAppSelector((state) => state.ui.isZooming);
  const userPostion = useAppSelector((state) => state.nav.userPosition);

  const [usedPanning, setUsedPanning] = useState<boolean>(false);
  const [visibleBuildings, setVisibleBuildings] = useState<Building[]>([]);
  const [showFloor, setShowFloor] = useState<boolean>(false);

  // draw user position blue circle
  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (!userPostion) {
      return;
    }

    const circle = new mapkit.CircleOverlay(
      new mapkit.Coordinate(userPostion.latitude, userPostion.longitude),
      3,
    );

    map.addOverlay(circle);

    return () => {
      map.removeOverlay(circle);
    };
  });

  // React to pan/zoom events
  const { onRegionChangeStart, onRegionChangeEnd } = useMapPosition(
    (region, density) => {
      dispatch(setCardWrapperStatus(COLLAPSED));

      if (!buildings) {
        return;
      }
      const calculateVisibleBuildings = (region: CoordinateRegion) => {
        if (!buildings) {
          console.error(
            'Buildings not loaded when calculating visible buildings!',
          );
          return;
        }

        const boundingBox = {
          minLatitude: region.centerLatitude - region.latitudeDelta / 2,
          maxLatitude: region.centerLatitude + region.latitudeDelta / 2,
          minLongitude: region.centerLongitude - region.longitudeDelta / 2,
          maxLongitude: region.centerLongitude + region.longitudeDelta / 2,
        };

        const buildingsToFocus = Object.values(buildings).filter((building) => {
          const [buildingLats, buildingLongs] = building.shapes[0].reduce(
            (acc: [number[], number[]], point: Coordinate) => {
              acc[0].push(point.latitude);
              acc[1].push(point.longitude);
              return acc;
            },
            [[], []],
          );

          const buildingBoundingBox = {
            minLatitude: Math.min(...buildingLats),
            maxLatitude: Math.max(...buildingLats),
            minLongitude: Math.min(...buildingLongs),
            maxLongitude: Math.max(...buildingLongs),
          };

          const horizontalPoints = [
            [boundingBox.minLatitude, -1],
            [boundingBox.maxLatitude, -1],
            [buildingBoundingBox.minLatitude, 1],
            [buildingBoundingBox.maxLatitude, 1],
          ];
          const verticalPoints = [
            [boundingBox.minLongitude, -1],
            [boundingBox.maxLongitude, -1],
            [buildingBoundingBox.minLongitude, 1],
            [buildingBoundingBox.maxLongitude, 1],
          ];
          horizontalPoints.sort((a, b) => a[0] - b[0]);
          verticalPoints.sort((a, b) => a[0] - b[0]);

          const horizantalOverlap =
            !(horizontalPoints[0][1] == -1 && horizontalPoints[1][1] == -1) &&
            !(horizontalPoints[2][1] == -1 && horizontalPoints[3][1] == -1);
          const verticalOverlap =
            !(verticalPoints[0][1] == -1 && verticalPoints[1][1] == -1) &&
            !(verticalPoints[2][1] == -1 && verticalPoints[3][1] == -1);

          return horizantalOverlap && verticalOverlap;
        });
        setVisibleBuildings(buildingsToFocus);
      };

      const throttledCalculateVisibleBuildings = throttle(
        (region: CoordinateRegion) => {
          calculateVisibleBuildings(region);
        },
        1000,
      );

      throttledCalculateVisibleBuildings(region);

      const newShowFloor = density >= THRESHOLD_DENSITY_TO_SHOW_FLOORS;
      setShowFloor(newShowFloor);
      dispatch(setShowRoomNames(density >= THRESHOLD_DENSITY_TO_SHOW_ROOMS));

      // don't set floor when zooming on room
      if (isZooming) {
        return;
      }

      // there is no focused floor if we are not showing floors
      if (!newShowFloor) {
        dispatch(setFocusedFloor(null));
      }
      // if we are showing floor, we will show the default floor of the centered building
      else {
        const center = {
          latitude: region.centerLatitude,
          longitude: region.centerLongitude,
        };

        const centerBuilding =
          Object.values(buildings).find(
            (building: Building) =>
              building.shapes &&
              isInPolygonCoordinates(building.shapes.flat(2), center),
          ) ?? null;

        if (centerBuilding) {
          // if no floor is focused
          //   - we focus on the floor of the selected room if there is one
          //     and it is in the center building
          //   - otherwise we focus on the default floor of the center building
          if (!focusedFloor) {
            if (selectedRoom) {
              if (selectedRoom.floor.buildingCode == centerBuilding.code) {
                dispatch(setFocusedFloor(selectedRoom.floor));
                return;
              }
            }

            const newFocusFloor = {
              buildingCode: centerBuilding.code,
              level: centerBuilding.defaultFloor,
            };

            dispatch(setFocusedFloor(newFocusFloor));
          }

          // if we are focusing on a different building,
          // then focus on the floor of the center building
          // that is the same ordinal as the currently focused floor
          else {
            const focusedBuilding = buildings[focusedFloor.buildingCode];
            if (focusedBuilding.code != centerBuilding.code) {
              const newFocusFloor = getFloorAtOrdinal(
                centerBuilding,
                getOrdinalOfFloor(focusedBuilding, focusedFloor),
              );

              dispatch(setFocusedFloor(newFocusFloor));
            }
          }
        }
      }
    },
    mapRef,
    initialRegion,
  );

  // DO NOT DELETE THIS MYSTERIOUS CODE IT HELPS THE PINS TO LOAD FASTER
  // The working theory on why this works is that without any annotations, mapkit deletes the annotation layer
  // so when we want to conjure the pins, we need to create a new annotation layer, which takes ~3s for no apparent reason
  const handleLoad = () => {
    if (!mapRef.current) {
      return;
    }

    mapRef.current.addEventListener('scroll-end', () => {
      setUsedPanning(true);
    });

    const randomCoordinate = new mapkit.Coordinate(40.444, -79.945);
    const pinOptions = {
      url: {
        1: '/assets/empty_pixel.png',
      },
      size: { width: 0, height: 0 },
    };
    const pinAnnotation = new mapkit.ImageAnnotation(
      randomCoordinate,
      pinOptions,
    );
    mapRef.current?.addAnnotation(pinAnnotation);
  };

  const renderSelectedRoomPin = () => {
    if (selectedRoom) {
      return (
        <Annotation
          latitude={selectedRoom.labelPosition.latitude}
          longitude={selectedRoom.labelPosition.longitude}
        >
          <div
            className="flex flex-col items-center"
            onClick={(e) => {
              zoomOnRoom(mapRef.current, selectedRoom, dispatch);
              e.stopPropagation();
            }}
          >
            <RoomPin room={{ ...selectedRoom, id: selectedRoom?.id }} />
            <div className="text-center text-sm font-bold leading-[1.1] tracking-wide">
              <p>{selectedRoom.name}</p>
              {selectedRoom.alias && (
                <p className="w-16 text-wrap italic">{selectedRoom.alias}</p>
              )}
            </div>
          </div>
        </Annotation>
      );
    }
  };

  const handleClick = (e: MapInteractionEvent) => {
    // skip if usedPanning is true since end of panning is a click
    if (usedPanning) {
      setUsedPanning(false);
      return;
    }

    // check if a building is clicked
    let clickedBuilding = false;

    if (!showFloor) {
      const coords = e.toCoordinates();

      for (const buildingCode in buildings) {
        if (
          buildings[buildingCode].shapes[0] &&
          isInPolygonCoordinates(buildings[buildingCode].shapes[0], coords)
        ) {
          dispatch(selectBuilding(buildings[buildingCode]));
          clickedBuilding = true;
          break;
        }
      }
    }

    if (!choosingRoomMode && !isNavOpen) {
      dispatch(setIsSearchOpen(false));
      dispatch(deselectRoom());
      if (!clickedBuilding) {
        dispatch(deselectBuilding());
      }
    } else if (choosingRoomMode) {
      if (choosingRoomMode == 'start') {
        dispatch(setStartLocation({ waypoint: e.toCoordinates() }));
      } else if (choosingRoomMode == 'end') {
        dispatch(setEndLocation({ waypoint: e.toCoordinates() }));
      }
      dispatch(setIsSearchOpen(false));
      dispatch(setChoosingRoomMode(null));
    }
  };

  const mockPositions = [
    [40.44249719447571, -79.94314319195851],
    [40.441888072786064, -79.94442558459103],
  ];

  return (
    <Map
      ref={mapRef}
      token={process.env.NEXT_PUBLIC_MAPKITJS_TOKEN || ''}
      initialRegion={initialRegion}
      includedPOICategories={[]}
      cameraBoundary={cameraBoundary}
      minCameraDistance={5}
      maxCameraDistance={1500}
      showsUserLocationControl
      showsUserLocation={true}
      mapType={MapType.MutedStandard}
      paddingBottom={isMobile ? 72 : 0}
      paddingLeft={4}
      paddingRight={4}
      paddingTop={10}
      showsZoomControl={!isMobile}
      showsCompass={FeatureVisibility.Visible}
      allowWheelToZoom
      onRegionChangeStart={onRegionChangeStart}
      onRegionChangeEnd={() => {
        dispatch(setIsZooming(false));
        onRegionChangeEnd();
      }}
      onClick={handleClick}
      onLoad={handleLoad}
    >
      {buildings &&
        Object.values(buildings).map(
          (building) =>
            mapRef.current && (
              <BuildingShape
                key={building.code}
                map={mapRef.current}
                building={building}
              />
            ),
        )}

      {focusedFloor && showFloor && (
        <FloorPlanOverlay visibleBuildings={visibleBuildings} />
      )}

      {mapRef.current && <NavLine map={mapRef.current} />}

      {renderSelectedRoomPin()}

      {mockPositions.map((position, index) => (
        <Annotation key={index} latitude={position[0]} longitude={position[1]}>
          <EventPin />
        </Annotation>
      ))}
    </Map>
  );
};

export default MapDisplay;
