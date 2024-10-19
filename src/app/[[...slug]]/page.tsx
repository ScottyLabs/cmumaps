'use client';

import { UserButton } from '@clerk/nextjs';
import questionMarkIcon from '@icons/question-mark.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import React, { useEffect, useRef } from 'react';
import { getSelectorsByUserAgent } from 'react-device-detect';
import { Slide, ToastContainer } from 'react-toastify';

import MapDisplay from '@/components/buildings/MapDisplay';
import {
  getRoomIdByNameAndFloor,
  zoomOnObject,
  zoomOnRoomByName,
} from '@/components/buildings/mapUtils';
import ToolBar from '@/components/toolbar/ToolBar';
import {
  setBuildings,
  setEateryData,
  setAvailableRoomImages,
  setSearchMap,
  setFloorPlanMap,
} from '@/lib/features/dataSlice';
import {
  setEndLocation,
  setIsNavOpen,
  setStartLocation,
  setUserPosition,
} from '@/lib/features/navSlice';
import {
  setFocusedFloor,
  setIsMobile,
  selectBuilding,
  getIsCardOpen,
} from '@/lib/features/uiSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Building, Room } from '@/types';
import { getEateryData } from '@/util/eateryUtils';

// const mockUserPosition = [40.44249719447571, -79.94314319195851];

interface Props {
  params: {
    slug?: string[];
  };
  searchParams: {
    src?: string;
    dst?: string;
    userAgent?: string;
  };
}

/**
 * The main page of the CMU Map website.
 */
const Page = ({ params, searchParams }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const mapRef = useRef<mapkit.Map | null>(null);

  const floorPlanMap = useAppSelector((state) => state.data.floorPlanMap);
  const buildings = useAppSelector((state) => state.data.buildings);

  const focusedFloor = useAppSelector((state) => state.ui.focusedFloor);
  const isMobile = useAppSelector((state) => state.ui.isMobile);
  const selectedRoom = useAppSelector((state) => state.ui.selectedRoom);
  const selectedBuilding = useAppSelector((state) => state.ui.selectedBuilding);
  const isSearchOpen = useAppSelector((state) => state.ui.isSearchOpen);
  const isCardOpen = useAppSelector((state) => getIsCardOpen(state.ui));

  const startLocation = useAppSelector((state) => state.nav.startLocation);
  const endLocation = useAppSelector((state) => state.nav.endLocation);

  // extracting data in the initial loading of the page
  useEffect(() => {
    // makes all required things are loaded
    if (mapRef.current && buildings && params.slug && params.slug.length > 0) {
      const code = params.slug[0];
      // only building code
      if (!code.includes('-')) {
        // the code is the building code
        dispatch(selectBuilding(buildings[code]));
      }
      // at least floor level
      else {
        const buildingCode = code.split('-')[0];
        const roomName = code.split('-')[1];
        const floorLevel = roomName[0];

        const building = buildings[buildingCode];

        // validations on the building code
        if (!building) {
          router.push('/');
          return;
        }

        // validations on the floor level
        if (!building.floors.includes(floorLevel)) {
          router.push(buildingCode);
          return;
        }

        const floor = { buildingCode, level: floorLevel };

        // if only contains floor information
        if (roomName.length == 1) {
          // up to floor level
          dispatch(selectBuilding(building));
          zoomOnObject(mapRef.current, building.shapes.flat());
          dispatch(setFocusedFloor(floor));
        } else {
          zoomOnRoomByName(
            mapRef.current,
            roomName,
            floor,
            buildings,
            floorPlanMap,
            dispatch,
          );
        }
      }

      // navigation
      const src = searchParams.src;
      const dst = searchParams.dst;

      // only dst is required; you can't have only src and not dst
      if (dst) {
        const assignHelper = (code: string, setLocation): boolean => {
          // only building code
          if (!code.includes('-')) {
            if (!buildings[code]) {
              return false;
            }

            // the code is the building code
            dispatch(setLocation(buildings[code]));
            return true;
          }
          // at least floor level
          else {
            const buildingCode = code.split('-')[0];
            const roomName = code.split('-')[1];
            const floorLevel = roomName[0];

            const building = buildings[buildingCode];

            // validations on the building code
            if (!building) {
              return false;
            }

            // if only contains floor information
            if (roomName.length == 1) {
              return false;
            }

            const floor = { buildingCode, level: floorLevel };

            const roomId = getRoomIdByNameAndFloor(
              roomName,
              floor,
              buildings,
              floorPlanMap,
            );

            // validations on the room name
            if (!roomId) {
              return false;
            }

            // validations on the floor level
            if (!building.floors.includes(floorLevel)) {
              return false;
            }

            const floorPlan = floorPlanMap[floor.buildingCode][floor.level];
            const room = floorPlan[roomId];

            dispatch(setLocation(room));

            return true;
          }
        };

        if (src) {
          assignHelper(src, setStartLocation);
        }

        const succeeded = assignHelper(dst, setEndLocation);
        if (succeeded) {
          dispatch(setIsNavOpen(true));
        }
      }
    }
  }, [
    buildings,
    dispatch,
    params.slug,
    router,
    mapRef,
    floorPlanMap,
    searchParams,
  ]);

  // determine the device type
  const userAgent = searchParams.userAgent || '';
  useEffect(() => {
    if (userAgent) {
      const { isMobile } = getSelectorsByUserAgent(userAgent);
      dispatch(setIsMobile(isMobile));
    }
  }, [userAgent, dispatch]);

  // get user position
  useEffect(() => {
    navigator?.geolocation?.getCurrentPosition((pos) => {
      const coord = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };

      dispatch(setUserPosition(coord));
    });
  }, [dispatch]);

  // load the list of images of the rooms
  useEffect(() => {
    const getRoomImageList = async () => {
      const res = await fetch('/assets/location_images/list_of_files.txt');
      const txt = await res.text();
      const lines = txt.trim().split('\n');

      const roomImageList: Record<string, string[]> = {};

      let curBuilding = '';

      for (const line of lines) {
        if (line.startsWith('├──')) {
          curBuilding = line.substring(4);
          roomImageList[curBuilding] = [];
        } else if (line.includes('.jpg')) {
          const curRoom = line.split(' ').at(-1);
          if (curRoom) {
            roomImageList[curBuilding].push(curRoom);
          }
        }
      }

      dispatch(setAvailableRoomImages(roomImageList));
    };
    getRoomImageList();
  }, [dispatch]);

  // load the eatery data
  useEffect(() => {
    getEateryData().then((eateryData) => dispatch(setEateryData(eateryData)));
  }, [dispatch]);

  // load the buildings and searchMap and floorPlanMap data
  useEffect(() => {
    if (!dispatch) {
      return;
    }
    // set buildings
    fetch('/cmumaps-data/buildings.json').then((response) =>
      response.json().then((buildings) => dispatch(setBuildings(buildings))),
    );

    // set searchMap
    fetch('/cmumaps-data/searchMap.json').then((response) =>
      response.json().then((searchMap) => {
        dispatch(setSearchMap(searchMap));
      }),
    );

    // set floorPlanMap
    fetch('/cmumaps-data/floorPlanMap.json').then((response) =>
      response.json().then((floorPlanMap) => {
        dispatch(setFloorPlanMap(floorPlanMap));
      }),
    );
  }, [dispatch]);

  // update the page title
  useEffect(() => {
    let title = 'CMU Maps';
    if (selectedRoom) {
      if (selectedRoom.alias) {
        title = `${selectedRoom.alias} - CMU Maps`;
      } else {
        title = `${selectedRoom.floor.buildingCode} ${selectedRoom.name} - CMU Maps`;
      }
    } else if (buildings && focusedFloor) {
      const buildingCode = buildings[focusedFloor.buildingCode].code;
      title = `${buildingCode} Floor ${focusedFloor.level} - CMU Maps`;
    } else if (selectedBuilding) {
      title = `${selectedBuilding.name} - CMU Maps`;
    }
    document.title = title;
  }, [buildings, selectedBuilding, focusedFloor, selectedRoom]);

  // update the URL
  useEffect(() => {
    let url = window.location.origin + '/';

    const roomToString = (room: Room) => {
      const floor = room.floor;
      return `${floor.buildingCode}-${room.name}`;
    };

    // selected/focused room, floor, building
    if (selectedRoom) {
      url += roomToString(selectedRoom);
    } else if (focusedFloor) {
      url += `${focusedFloor.buildingCode}`;
      url += `-${focusedFloor.level}`;
    } else if (selectedBuilding) {
      url += selectedBuilding.code;
    }

    // navigation
    const toString = (location: Room | Building) => {
      if ('id' in location) {
        return roomToString(location);
      } else {
        return location.code;
      }
    };

    if (startLocation) {
      url += `?src=${toString(startLocation)}`;
    }

    if (endLocation) {
      if (startLocation) {
        url += '&';
      } else {
        url += '?';
      }
      url += `dst=${toString(endLocation)}`;
    }

    window.history.pushState({}, '', url);
    // use window instead of the next router to prevent rezooming in
  }, [
    selectedRoom,
    focusedFloor,
    selectedBuilding,
    startLocation,
    endLocation,
  ]);

  const renderIcons = () => {
    // don't show icons if in mobile and either the search is open or the card is open
    if (isMobile && (isSearchOpen || isCardOpen)) {
      return <></>;
    }

    const renderClerkIcon = () => {
      if (isMobile) {
        return (
          <div className="fixed bottom-[7.5rem] right-3 flex items-center justify-center rounded-full bg-[#4b5563] p-2">
            <UserButton />
          </div>
        );
      } else {
        return (
          <div className="fixed right-6 top-14">
            <UserButton />
          </div>
        );
      }
    };

    const renderQuestionMarkIcon = () => {
      return (
        <div className="btn-shadow fixed bottom-[4.5rem] right-3 rounded-full sm:bottom-16 sm:right-3.5">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.google.com/document/d/1jZeIij72ovf3K2J1J57rlD4pz3xnca3BfPedg9Ff1sc/edit"
          >
            <Image
              alt="Question Mark"
              src={questionMarkIcon}
              height={isMobile ? 43 : 50}
            />
          </a>
        </div>
      );
    };

    return (
      <>
        {renderClerkIcon()}
        {renderQuestionMarkIcon()}
        {/* {isMobile && (
          <div className="fixed bottom-16 right-2 size-10 cursor-pointer rounded-full bg-black">
            <Image alt="Schedule" src={scheduleIcon} />
          </div>
        )} */}
      </>
    );
  };

  return (
    <main className="relative h-screen">
      <div className="absolute z-10">
        <ToolBar map={mapRef.current} />

        {renderIcons()}

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          closeOnClick
          theme="colored"
          transition={Slide}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        />
      </div>

      <MapDisplay mapRef={mapRef} />
    </main>
  );
};

export default Page;
