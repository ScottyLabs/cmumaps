import DesktopToolbar from "@/components/toolbar/DesktopToolbar";
import MobileToolbar from "@/components/toolbar/MobileToolbar";
import useIsMobile from "@/hooks/useIsMobile";

interface Props {
  map: mapkit.Map | null;
}

const Toolbar = ({ map }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileToolbar map={map} />;
  } else {
    return <DesktopToolbar map={map} />;
  }
};

export default Toolbar;
