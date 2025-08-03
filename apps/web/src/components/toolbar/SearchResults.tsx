import { useMemo } from "react";
import { useNavigate } from "react-router";
import $api from "@/api/client";
import $rapi from "@/api/rustClient";
import classroomIcon from "@/assets/icons/search_results/study.svg";
import useBoundStore from "@/store";
import { getFloorLevelFromRoomName } from "@/utils/floorUtils";
import prefersReducedMotion from "@/utils/prefersReducedMotion";
import { zoomOnObject } from "@/utils/zoomUtils";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
  searchQuery: string;
}

const SearchResults = ({ searchQuery, mapRef }: Props) => {
  // Global state
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);
  const hidesSearch = useBoundStore((state) => state.hideSearch);
  const focusFloor = useBoundStore((state) => state.focusFloor);

  const navigate = useNavigate();

  const { data: searchResults } = $rapi.useQuery("get", "/search", {
    params: { query: { query: searchQuery } },
    enabled: isSearchOpen && searchQuery.length > 0,
  });

  const { data: buildings } = $api.useQuery("get", "/buildings");

  const organizedResults = useMemo(() => {
    if (!searchResults) return [];

    const buildings = searchResults.filter(
      (result) => result.type === "building",
    );
    const rooms = searchResults.filter((result) => result.type === "room");

    return [...buildings, ...rooms];
  }, [searchResults]);

  // Don't render if the search is not open or the search query is empty
  if (searchQuery.length === 0 || !isSearchOpen) {
    return;
  }

  // No results found
  return (
    <div className="flex-col overflow-hidden overflow-y-scroll bg-white">
      {organizedResults?.map((result, i) => (
        <button
          type="button"
          key={i}
          className="flex h-19 w-full items-center bg-white text-lg active:bg-[#dce8f6]"
          onClick={() => {
            if (result.type === "room") {
              const roomName = result.nameWithSpace?.split(" ")[1];
              const buildingName = result.nameWithSpace?.split(" ")[0];
              const floor = getFloorLevelFromRoomName(roomName);
              console.log(`Room: ${roomName}`);
              console.log(`Floor: ${floor}`);
              if (buildingName && floor) {
                focusFloor({ buildingCode: buildingName, level: floor });
                navigate(`/${buildingName}-${roomName}`);
              }
              const latitude = result.labelPosition?.latitude;
              const longitude = result.labelPosition?.longitude;
              if (latitude && longitude && mapRef.current) {
                // zoomOnPoint(
                //   mapRef.current,
                //   new mapkit.Coordinate(latitude, longitude),
                // );
                // if (floor) {
                //   zoomOnFloor(mapRef.current, buildings, floor);
                // }
                // if (buildingName && buildings?.[buildingName]) {
                //   zoomOnObject(
                //     mapRef.current,
                //     buildings[buildingName].shape.flat(),
                //   );
                // } else {
                const offset = 0.0005;
                mapRef.current.setRegionAnimated(
                  new mapkit.BoundingRegion(
                    latitude + offset,
                    longitude + offset,
                    latitude - offset,
                    longitude - offset,
                  ).toCoordinateRegion(),
                  !prefersReducedMotion(),
                );
                // }
              }
            } else {
              navigate(`/ ${result.id} `);
              const building = buildings?.[result.id];
              if (building && mapRef.current) {
                zoomOnObject(mapRef.current, building.shape.flat());
              }
            }
            hidesSearch();
          }}
        >
          {result.type === "building" ? (
            <>
              <div className="mr-2 ml-5 flex h-7 w-7 flex-shrink-0 flex-col items-center justify-center rounded-full bg-[#4b5563] text-white text-xs">
                {result.id}
              </div>
              <div className="flex flex-col">
                {/* {result.alias && result.type === "room" && `${ result.alias } - `} */}
                {result.fullNameWithSpace}
              </div>
            </>
          ) : (
            <>
              <div className="mr-2 ml-5 flex h-7 w-7 flex-shrink-0 flex-col items-center justify-center rounded-md bg-[#4b5563] text-white">
                <img width={18} src={classroomIcon} alt="classroom" />
              </div>
              <div className="flex w-[100%] justify-between">
                <div className="flex flex-col">
                  {/* {result.alias && result.type === "room" && `${ result.alias } - `} */}
                  {result.alias && result.alias !== ""
                    ? result.alias
                    : result.fullNameWithSpace}
                </div>
                <div className="flex flex-col self-end pr-5 text-[#9ca3af]">
                  Rooms
                </div>
              </div>
            </>
          )}
        </button>
      ))}
    </div>
  );
};

export default SearchResults;
