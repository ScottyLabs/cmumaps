import { useMemo } from "react";
import $rapi from "@/api/rustClient";
import classroomIcon from "@/assets/icons/search_results/study.svg";
import useBoundStore from "@/store";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
  searchQuery: string;
}

const SearchResults = ({ searchQuery }: Props) => {
  // Global state
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);

  const { data: searchResults } = $rapi.useQuery("get", "/search", {
    params: { query: { query: searchQuery } },
    enabled: isSearchOpen && searchQuery.length > 0,
  });

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
        <div key={i} className="flex h-19 items-center bg-white text-lg">
          {result.type === "building" ? (
            <>
              <div className="mr-2 ml-5 flex h-7 w-7 flex-shrink-0 flex-col items-center justify-center rounded-full bg-[#4b5563] text-white text-xs">
                {result.id}
              </div>
              <div className="flex flex-col">
                {/* {result.alias && result.type === "room" && `${result.alias} - `} */}
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
                  {/* {result.alias && result.type === "room" && `${result.alias} - `} */}
                  {result.nameWithSpace}
                </div>
                <div className="flex flex-col self-end pr-5 text-[#9ca3af]">
                  Rooms
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );

  // TODO: Render results
};

export default SearchResults;
