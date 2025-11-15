import { useMemo } from "react";
import $api from "@/api/client";
import $rapi from "@/api/rustClient";
import buildingIcon from "@/assets/icons/search_results/building.svg";
import userIcon from "@/assets/icons/search_results/mark.svg";
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
  const userPosition = useBoundStore((state) => state.userPosition);

  const navigate = useNavigateLocationParams();
  const { setSrc, setDst } = useNavigationParams();
  const { hasAccess } = useUser();

  const { data: searchResults } = $rapi.useQuery(
    "get",
    "/search",
    {
      params: { query: { query: searchQuery } },
    },
    {
      enabled: isSearchOpen && searchQuery.length > 0,
    },
  );

  const { data: buildings } = $api.useQuery("get", "/buildings");

  const organizedResults = useMemo(() => {
    if (!searchResults) return [];

    const buildings = searchResults.filter(
      (result) => result.type === "building",
    );
    const rooms = searchResults.filter((result) => result.type === "room");

    const userLocationResult: SearchResultProps = {
      id: "user",
      fullNameWithSpace: "User Position",
      type: "user",
      nameWithSpace: "user",
    };

    if (searchTarget && userPosition) {
      return [userLocationResult, ...buildings, ...rooms];
    }

    return [...buildings, ...rooms];
  }, [searchResults, userPosition, searchTarget]);

  // Don't render if the search is not open or the search query is empty
  if (searchQuery.length === 0 || !isSearchOpen) {
    return;
  }

  const renderBuildingResult = (result: SearchResultProps) => {
    return (
      <>
        <div className="mr-2 ml-4 flex h-7 w-7 flex-shrink-0 flex-col items-center justify-center rounded-md text-white">
          <img width={24} src={buildingIcon} alt="classroom" />
        </div>
        <div className="flex flex-col">{result.fullNameWithSpace}</div>
      </>
    );
  };

  const renderRoomResult = (result: SearchResultProps) => {
    return (
      <>
        <div className="mr-2 ml-4 flex h-7 w-7 flex-shrink-0 flex-col items-center justify-center rounded-md text-white">
          <img width={24} src={classroomIcon} alt="classroom" />
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

  const renderUserLocationResult = () => {
    return (
      <>
        <div className="mr-2 ml-4 flex h-7 w-7 flex-shrink-0 flex-col items-center justify-center rounded-md text-white">
          <img width={24} src={userIcon} alt="classroom" />
        </div>
        <div className="flex flex-col">User Position</div>
      </>
    );
  };

  const renderResultByType = (result: SearchResultProps) => {
    switch (result.type) {
      case "user":
        return renderUserLocationResult();
      case "building":
        return renderBuildingResult(result);
      default:
        return renderRoomResult(result);
    }
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
      switch (searchTarget) {
        case "nav-src":
          if (!result.labelPosition) break;
          setSrc(
            `${result.labelPosition?.latitude},${result.labelPosition?.longitude}`,
          );
          break;
        case "nav-dst":
          if (!result.labelPosition) break;
          navigate(
            `/${result.labelPosition?.latitude},${result.labelPosition?.longitude}`,
          );
          setDst(
            `${result.labelPosition?.latitude},${result.labelPosition?.longitude}`,
          );
          break;
        default:
          navigate("/");
          break;
      }
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

  const handleSelectUserLocation = (result: SearchResultProps) => {
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
  };

  const handleClick = (result: SearchResultProps) => {
    if (result.type === "room") {
      if (!hasAccess) {
        showLogin();
        return;
      }
      handleSelectRoom(result);
    } else if (result.type === "user") {
      handleSelectUserLocation(result);
    } else {
      handleSelectBuilding(result);
    }
    hideSearch();
    setSearchTarget(undefined);
  };

  // No results found
  return (
    <div className="z-50 flex-col overflow-hidden overflow-y-scroll rounded-[8px] bg-white">
      {organizedResults?.map((result, i) => (
        <button
          type="button"
          key={i}
          className="flex h-19 w-full items-center bg-white text-lg hover:bg-[#F5F5F5] active:bg-[#dce8f6]"
          onClick={() => handleClick(result)}
        >
          {renderResultByType(result)}
        </button>
      ))}
    </div>
  );
};

export default SearchResults;
