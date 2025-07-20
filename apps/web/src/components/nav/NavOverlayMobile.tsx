import { useState } from "react";
import NavCard from "./NavCard";
import NavDirectionsList from "./NavDirectionsList";
import NavHeader from "./NavHeader";

interface NavOverlayMobileProps {
  isNavigating: boolean;
  startNav: () => void;
}

const NavOverlayMobile = ({
  isNavigating,
  startNav,
}: NavOverlayMobileProps) => {
  const [listShown, setListShown] = useState(false);

  return (
    <>
      <NavCard
        isNavigating={isNavigating}
        startNav={startNav}
        toggleListShown={() => {
          setListShown(!listShown);
        }}
        listShown={listShown}
      />
      <NavHeader
        isNavigating={isNavigating}
        startNav={startNav}
        listShown={listShown}
      />
      <NavDirectionsList show={listShown} />
    </>
  );
};

export default NavOverlayMobile;
