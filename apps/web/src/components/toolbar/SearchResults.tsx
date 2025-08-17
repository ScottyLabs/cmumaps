import { useMemo } from "react";
import $api from "@/api/client";
import $rapi from "@/api/rustClient";
import classroomIcon from "@/assets/icons/search_results/study.svg";
import useNavigateLocationParams from "@/hooks/useNavigateLocationParams";
import useNavigationParams from "@/hooks/useNavigationParams";
import useUser from "@/hooks/useUser";
import useBoundStore from "@/store";
import { CardStates } from "@/store/cardSlice";
import { getFloorLevelFromRoomName } from "@/utils/floorUtils";
import { zoomOnObject, zoomOnPoint } from "@/utils/zoomUtils";

interface SearchResultProps {
  id: string;
  nameWithSpace?: string;
  fullNameWithSpace?: string;
  alias?: string;
  type?: string;
  labelPosition?: { latitude?: number; longitude?: number };
  floor?: { buildingCode?: string; level?: string };
}

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
  searchQuery: string;
}

const SearchResults = ({ searchQuery, mapRef }: Props) => {
  // Global state
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);
  const hideSearch = useBoundStore((state) => state.hideSearch);
  const setIsZooming = useBoundStore((state) => state.setIsZooming);
  const setCardStatus = useBoundStore((state) => state.setCardStatus);
  const searchTarget = useBoundStore((state) => state.searchTarget);
  const setSearchTarget = useBoundStore((state) => state.setSearchTarget);
  const focusFloor = useBoundStore((state) => state.focusFloor);
  const showLogin = useBoundStore((state) => state.showLogin);

  const navigate = useNavigateLocationParams();
  const { setSrc, setDst } = useNavigationParams();
  const { hasAccess } = useUser();

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

  const renderBuildingResult = (result: SearchResultProps) => {
    return (
      <>
        <div className="mr-2 ml-5 flex h-7 w-7 flex-shrink-0 flex-col items-center justify-center rounded-full bg-[#4b5563] text-white text-xs">
          {result.id}
        </div>
        <div className="flex flex-col">{result.fullNameWithSpace}</div>
      </>
    );
  };

  const renderRoomResult = (result: SearchResultProps) => {
    return (
      <>
        <div className="mr-2 ml-5 flex h-7 w-7 flex-shrink-0 flex-col items-center justify-center rounded-md bg-[#4b5563] text-white">
          <img width={18} src={classroomIcon} alt="classroom" />
        </div>
        <div className="flex w-[100%] items-center justify-between">
          <div className="flex flex-col text-left">
            {result.alias && result.alias !== ""
              ? result.alias
              : result.fullNameWithSpace}
          </div>
          <div className="self-center pr-5 text-[#9ca3af]">Rooms</div>
        </div>
      </>
    );
  };

  const handleSelectRoom = (result: SearchResultProps) => {
    const roomName = result.nameWithSpace?.split(" ")[1];
    const buildingName = result.nameWithSpace?.split(" ")[0];
    const floor = getFloorLevelFromRoomName(roomName);
    if (
      buildingName &&
      floor &&
      buildings?.[buildingName]?.floors.includes(floor)
    ) {
      switch (searchTarget) {
        case "nav-src":
          setSrc(`${buildingName}-${roomName}`);
          break;
        case "nav-dst":
          navigate(`/${buildingName}-${roomName}`);
          setDst(`${buildingName}-${roomName}`);
          break;
        default:
          navigate(`/${buildingName}-${roomName}`);
          setCardStatus(CardStates.COLLAPSED);
          break;
      }
      focusFloor({ buildingCode: buildingName, level: floor });
    } else {
      navigate("/");
    }

    const latitude = result.labelPosition?.latitude;
    const longitude = result.labelPosition?.longitude;
    if (latitude && longitude && mapRef.current) {
      const newRegionSize = 0.0005;
      zoomOnPoint(
        mapRef.current,
        new mapkit.Coordinate(latitude, longitude),
        newRegionSize,
        setIsZooming,
      );
    }
  };

  const handleSelectBuilding = (result: SearchResultProps) => {
    switch (searchTarget) {
      case "nav-src":
        setSrc(result.id);
        break;
      case "nav-dst":
        navigate(`/${result.id}`);
        setDst(result.id);
        break;
      default:
        navigate(`/${result.id}`);
        break;
    }
    const building = buildings?.[result.id];
    if (building && mapRef.current) {
      zoomOnObject(mapRef.current, building.shape.flat(), setIsZooming);
    }
  };

  const handleClick = (result: SearchResultProps) => {
    if (result.type === "room") {
      if (!hasAccess) {
        showLogin();
        return;
      }
      handleSelectRoom(result);
    } else {
      handleSelectBuilding(result);
    }
    hideSearch();
    setSearchTarget(undefined);
  };

  // No results found
  return (
    <div className="flex-col overflow-hidden overflow-y-scroll bg-white">
      {organizedResults?.map((result, i) => (
        <button
          type="button"
          key={i}
          className="flex h-19 w-full items-center bg-white text-lg active:bg-[#dce8f6]"
          onClick={() => handleClick(result)}
        >
          {result.type === "building"
            ? renderBuildingResult(result)
            : renderRoomResult(result)}
        </button>
      ))}
    </div>
  );
};

export default SearchResults;
