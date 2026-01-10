import { useIsMobile } from "@/hooks/useIsMobile.ts";
import { IconsDisplayDesktop } from "./desktop/IconsDisplayDesktop.tsx";
import { IconsDisplayMobile } from "./mobile/IconsDisplayMobile.tsx";

const IconsDisplay = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <IconsDisplayMobile />;
  }
  return <IconsDisplayDesktop />;
};

export { IconsDisplay };
