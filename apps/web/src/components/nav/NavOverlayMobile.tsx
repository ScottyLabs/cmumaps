import { useState } from "react";
import NavCard from "./NavCard";
import NavDirectionsList from "./NavDirectionsList";
import NavHeader from "./NavHeader";

interface NavOverlayMobileProps {
  isNavigating: boolean;
  startNav: () => void;
  mapRef: React.RefObject<mapkit.Map | null>;
}

const NavOverlayMobile = ({
  isNavigating,
  startNav,
  mapRef,
}: NavOverlayMobileProps) => {
  const [listShown, setListShown] = useState(false);

  return (
    <>
      <NavHeader
        isNavigating={isNavigating}
        startNav={startNav}
        listShown={listShown}
        mapRef={mapRef}
      />
      <NavDirectionsList show={listShown} />
      <NavCard
        isNavigating={isNavigating}
        startNav={startNav}
        toggleListShown={() => {
          setListShown(!listShown);
        }}
        listShown={listShown}
      />
    </>
  );
};

export default NavOverlayMobile;
