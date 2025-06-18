import DesktopToolbar from "@/components/toolbar/DesktopToolbar";
import MobileToolbar from "@/components/toolbar/MobileToolbar";
import useIsMobile from "@/hooks/useIsMobile";

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

export default Toolbar;
