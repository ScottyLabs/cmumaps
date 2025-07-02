import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import useClerkToken from "@/hooks/useClerkToken";
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

  const token = useClerkToken();

  const [path, setPath] = useState({
    fastest: null,
    indoor: null,
    outdoor: null,
  });
  const [pathDist, setPathDist] = useState(0);

  useEffect(() => {
    if (!dst || dst === "") {
      endNav();
      console.log("endNav");
    }
  }, [dst, endNav]);

  useEffect(() => {
    const haversineDistance = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number,
    ) => {
      var R = 3963; // Radius of the earth in km
      var dLat = (Math.PI / 180) * (lat2 - lat1); // deg2rad below
      var dLon = (Math.PI / 180) * (lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((Math.PI / 180) * lat1) *
          Math.cos((Math.PI / 180) * lat2) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d;
    };
    if (
      !src ||
      !dst ||
      src === "" ||
      dst === "" ||
      src === "user" ||
      dst === "user"
    ) {
      return;
    }
    console.log("REQUESTING:");
    fetch(`http://localhost:3278/path?start=${src}&end=${dst}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPath(data);
        setPathDist(
          haversineDistance(
            data["fastest"][0]["coordinate"]["latitude"],
            data["fastest"][0]["coordinate"]["longitude"],
            data["fastest"][1]["coordinate"]["latitude"],
            data["fastest"][1]["coordinate"]["longitude"],
          ),
        );
        console.log(
          `pathDist: ${pathDist} coords: ${[
            data["fastest"][0]["coordinate"]["latitude"],
            data["fastest"][0]["coordinate"]["longitude"],
            data["fastest"][1]["coordinate"]["latitude"],
            data["fastest"][1]["coordinate"]["longitude"],
          ]}`,
        );
      });
  }, [src, dst]);

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
        pathDist={pathDist}
      />
    );
  }
};

export default NavOverlay;
