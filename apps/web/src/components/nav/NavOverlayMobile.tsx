import { getBuildingsQueryOptions } from "@/api/apiClient";
import useLocationParams from "@/hooks/useLocationParams";
import useBoundStore from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
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
