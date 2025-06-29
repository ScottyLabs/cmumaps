import NavCard from "./NavCard";
import NavHeader from "./NavHeader";

interface NavOverlayMobileProps {
  src: string;
  dst: string;
  isNavigating: boolean;
  setSrc: (_: string | null) => void;
  setDst: (_: string | null) => void;
  startNav: () => void;
}

const NavOverlayMobile = ({
  src,
  dst,
  setSrc,
  setDst,
  isNavigating,
  startNav,
}: NavOverlayMobileProps) => {
  return (
    <>
      <NavCard
        src={src}
        dst={dst}
        setSrc={setSrc}
        setDst={setDst}
        isNavigating={isNavigating}
        startNav={startNav}
      />
      <NavHeader
        src={src}
        dst={dst}
        setSrc={setSrc}
        setDst={setDst}
        isNavigating={isNavigating}
        startNav={startNav}
      />
    </>
  );
};

export default NavOverlayMobile;
