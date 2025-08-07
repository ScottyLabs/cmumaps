import useIsMobile from "@/hooks/useIsMobile";
import IconsDisplayDesktop from "./desktop/IconsDisplayDesktop";
import IconsDisplayMobile from "./mobile/IconsDisplayMobile";

const IconsDisplay = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <IconsDisplayMobile />;
  }
  return <IconsDisplayDesktop />;
};

export default IconsDisplay;
