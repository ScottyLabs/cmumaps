import { getSelectorsByUserAgent } from "react-device-detect";

const useIsMobile = () => {
  const { userAgent } = navigator;
  return getSelectorsByUserAgent(userAgent).isMobile;
};

export { useIsMobile };
