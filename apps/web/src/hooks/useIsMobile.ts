import { getSelectorsByUserAgent } from "react-device-detect";

const useIsMobile = () => {
  const userAgent = navigator.userAgent;
  return getSelectorsByUserAgent(userAgent).isMobile;
};

export default useIsMobile;
