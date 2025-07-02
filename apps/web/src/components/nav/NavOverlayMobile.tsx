import { useState } from "react";
import NavCard from "./NavCard";
import NavDirectionsList from "./NavDirectionsList";
import NavHeader from "./NavHeader";

interface NavOverlayMobileProps {
  src: string;
  dst: string;
  isNavigating: boolean;
  setSrc: (_: string | null) => void;
  setDst: (_: string | null) => void;
  startNav: () => void;
  pathDist: number;
}

const NavOverlayMobile = ({
  src,
  dst,
  setSrc,
  setDst,
  isNavigating,
  startNav,
  pathDist,
}: NavOverlayMobileProps) => {
  const [listShown, setListShown] = useState(false);

  return (
    <>
      <NavCard
        src={src}
        dst={dst}
        setSrc={setSrc}
        setDst={setDst}
        isNavigating={isNavigating}
        startNav={startNav}
        pathDist={pathDist}
        toggleListShown={() => {
          setListShown(!listShown);
        }}
        listShown={listShown}
      />
      <NavHeader
        src={src}
        dst={dst}
        setSrc={setSrc}
        setDst={setDst}
        isNavigating={isNavigating}
        startNav={startNav}
        listShown={listShown}
      />
      {listShown && <NavDirectionsList />}
    </>
  );
};

export default NavOverlayMobile;
