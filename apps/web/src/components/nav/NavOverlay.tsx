import { useQueryState } from "nuqs";
import { useEffect } from "react";
import $rapi from "@/api/rustClient";
import useIsMobile from "@/hooks/useIsMobile";
import useBoundStore from "@/store";
import type { NavPaths, Node } from "@/types/navTypes";
import NavOverlayMobile from "./NavOverlayMobile";

const NavOverlay = () => {
  const [src, _setSrc] = useQueryState("src");
  const [dst, _setDst] = useQueryState("dst");

  const isMobile = useIsMobile();

  const isNavigating = useBoundStore((state) => state.isNavigating);
  const startNav = useBoundStore((state) => state.startNav);
  const endNav = useBoundStore((state) => state.endNav);
  const setNavInstructions = useBoundStore((state) => state.setNavInstructions);

  const { data: navPaths } = $rapi.useQuery("get", "/path", {
    params: { query: { start: src ?? "", end: dst ?? "" } },
    enabled: !!src && !!dst,
  }) as { data: NavPaths | undefined };

  // Process instructions
  useEffect(() => {
    const instructions = navPaths?.Fastest?.instructions || [];
    const path: Node[] = navPaths?.Fastest?.path.path ?? [];

    const newInstructions = [];

    let oldInstructionsIndex = 0;
    path.forEach((node, index) => {
      if (node.id === instructions[oldInstructionsIndex]?.node_id) {
        newInstructions.push(instructions[oldInstructionsIndex]);
        oldInstructionsIndex++;
      }

      if (
        index < path.length - 1 &&
        node.floor.buildingCode === "outside" &&
        path[index + 1]?.floor.buildingCode !== "outside"
      ) {
        newInstructions.push({
          action: "Enter",
          distance: 0,
          node_id: node.id,
        });
      }
      if (
        index > 0 &&
        node.floor.buildingCode === "outside" &&
        path[index - 1]?.floor.buildingCode !== "outside"
      ) {
        newInstructions.push({
          action: "Exit",
          distance: 0,
          node_id: node.id,
        });
      }
    });

    newInstructions.push({
      action: "Forward",
      distance: 0,
      node_id: path[path.length - 1]?.id ?? "",
    });
    newInstructions.push({
      action: "Arrive",
      distance: 0,
      node_id: path[path.length - 1]?.id ?? "",
    });
    setNavInstructions?.(newInstructions);
  }, [navPaths, setNavInstructions]);

  // const setNavPaths = useBoundStore((state) => state.setNavPaths);

  // const processPathsData = (data: NavPaths) => {
  //   const processedPaths: NavPaths = {};
  //   for (const key in data) {
  //   }
  // };

  // const processPathInstructions = (path: NavPath) => {};

  useEffect(() => {
    if (!dst || dst === "") {
      endNav();
      console.log("endNav");
    }
  }, [dst, endNav]);

  // useEffect(() => {
  //   if (!src || !dst || src === "" || dst === "") {
  //     return;
  //   }
  //   console.log("REQUESTING:");
  //   fetch(`http://localhost:3278/path?start=${src}&end=${dst}`, {
  //     method: "GET",
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setNavPaths(data);
  //       console.log("Nav Paths: ", data);
  //     });
  // }, [src, dst, setNavPaths]);

  if (!dst || !src) {
    return;
  }

  if (isMobile) {
    return <NavOverlayMobile isNavigating={isNavigating} startNav={startNav} />;
  }
};

export default NavOverlay;
