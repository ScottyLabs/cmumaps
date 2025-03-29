import { useLocation } from "react-router";

const FLOOR_REGEX = /^[A-F0-9]|LL|M|EV|PH/; // matches A-F, 0-9, and LL at the start of a string

const useLocationParams = () => {
  const location = useLocation();
  const path = location.pathname;

  const [buildingCode, roomName] = path.split("/")?.[1]?.split("-") || [];
  const floor = roomName?.match(FLOOR_REGEX)?.[0] || "";

  return {
    buildingCode,
    floor,
    roomName,
    isCardOpen: !!buildingCode,
  };
};

export default useLocationParams;
