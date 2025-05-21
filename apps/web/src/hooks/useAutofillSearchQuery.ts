import { GeoRooms } from "@cmumaps/common";
import { skipToken, useQuery } from "@tanstack/react-query";

import { useCallback, useEffect } from "react";

import { apiClient } from "@/api/apiClient";
import useLocationParams from "@/hooks/useLocationParams";
import { getFloorCode } from "@/utils/floorUtils";

const useAutofillSearchQuery = (setSearchQuery: (query: string) => void) => {
  const { buildingCode, roomName, floor } = useLocationParams();
  const { data: buildings } = useQuery({
    queryKey: ["buildings"],
    queryFn: apiClient("buildings"),
  });
  const floorCode = getFloorCode(buildingCode, floor);
  const { data: rooms } = useQuery<GeoRooms>({
    queryKey: floorCode ? ["rooms", floorCode] : [],
    queryFn: floorCode ? apiClient(`floors/${floorCode}/floorplan`) : skipToken,
  });

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
