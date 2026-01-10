import { DesktopToolbar } from "@/components/toolbar/DesktopToolbar.tsx";
import { MobileToolbar } from "@/components/toolbar/MobileToolbar.tsx";
import { useIsMobile } from "@/hooks/useIsMobile.ts";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const Toolbar = ({ mapRef }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileToolbar mapRef={mapRef} />;
  }
  return <DesktopToolbar mapRef={mapRef} />;
};

export { Toolbar };
