import { useCallback, useEffect } from "react";

import useLocationParams from "@/hooks/useLocationParams";
import { useGetBuildingsQuery } from "@/store/features/api/apiSlice";

const useAutofillSearchQuery = (setSearchQuery: (query: string) => void) => {
  const { buildingCode, roomName } = useLocationParams();
  const { data: buildings } = useGetBuildingsQuery();

  const autoFillSearchQuery = useCallback(() => {
    // return the room name if a room is selected
    if (roomName) {
      // the search query is the room alias if the room has an alias,
      if (roomName) {
        setSearchQuery(roomName);
        return;
      }
      // otherwise it is the room floor name + the room name
      else {
        setSearchQuery(roomName);
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
  }, [buildingCode, buildings, roomName, setSearchQuery]);

  // set the search query using room and building
  useEffect(() => {
    autoFillSearchQuery();
  }, [autoFillSearchQuery]);
};

export default useAutofillSearchQuery;
