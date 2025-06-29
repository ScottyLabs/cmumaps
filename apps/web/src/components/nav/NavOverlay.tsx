import { useQueryState } from "nuqs";
import { useEffect } from "react";
import useIsMobile from "@/hooks/useIsMobile";
import useBoundStore from "@/store";
import NavOverlayMobile from "./NavOverlayMobile";

const NavOverlay = () => {
  const [src, setSrc] = useQueryState("src");
  const [dst, setDst] = useQueryState("dst");

  const isMobile = useIsMobile();

  const isNavigating = useBoundStore((state) => state.isNavigating);
  const startNav = useBoundStore((state) => state.startNav);
  const endNav = useBoundStore((state) => state.endNav);

  useEffect(() => {
    if (!dst || dst === "") {
      endNav();
      console.log("endNav");
    }
  }, [dst, endNav]);

  if (!dst || !src) {
    return;
  }

  if (isMobile) {
    return (
      <NavOverlayMobile
        src={src}
        dst={dst}
        setSrc={setSrc}
        setDst={setDst}
        isNavigating={isNavigating}
        startNav={startNav}
      />
    );
  }
};

export default NavOverlay;
