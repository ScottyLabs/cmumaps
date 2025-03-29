import { skipToken } from "@reduxjs/toolkit/query";

import { useCallback, useEffect } from "react";

import useLocationParams from "@/hooks/useLocationParams";
import {
  useGetBuildingsQuery,
  useGetFloorRoomsQuery,
} from "@/store/features/api/apiSlice";

const useAutofillSearchQuery = (setSearchQuery: (query: string) => void) => {
  const { buildingCode, roomName, floor } = useLocationParams();
  const { data: buildings } = useGetBuildingsQuery();
  const { data: rooms } = useGetFloorRoomsQuery(
    buildingCode && floor ? `${buildingCode}-${floor}` : skipToken,
  );

  const autoFillSearchQuery = useCallback(() => {
    // return the room name if a room is selected
    if (rooms && roomName) {
      // the search query is the room alias if the room has an alias,
      if (rooms[roomName]?.alias) {
        setSearchQuery(rooms[roomName].alias);
        return;
      }
      // otherwise it is the room floor name + the room name
      else {
        setSearchQuery(`${buildingCode} ${roomName}`);
        return;
      }
    }

    // return the building name if a building is selected
    if (buildings && buildingCode && buildings[buildingCode]) {
      setSearchQuery(buildings[buildingCode].name);
      return;
    }

    // set the search query to empty when there is no room or building selected
    setSearchQuery("");
  }, [buildingCode, buildings, rooms, roomName, setSearchQuery]);

  // set the search query using room and building
  useEffect(() => {
    autoFillSearchQuery();
  }, [autoFillSearchQuery]);
};

export default useAutofillSearchQuery;
