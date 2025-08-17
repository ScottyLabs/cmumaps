import { useQueryState } from "nuqs";
import { useEffect } from "react";
import env from "@/env";
import useIsMobile from "@/hooks/useIsMobile";
import useNavigationParams from "@/hooks/useNavigationParams";
import useUser from "@/hooks/useUser";
import useBoundStore from "@/store";
import type { Node } from "@/types/navTypes";
import NavOverlayMobile from "./NavOverlayMobile";

const NavOverlay = () => {
  const isMobile = useIsMobile();

  const isNavigating = useBoundStore((state) => state.isNavigating);
  const startNav = useBoundStore((state) => state.startNav);
  const endNav = useBoundStore((state) => state.endNav);
  const setNavInstructions = useBoundStore((state) => state.setNavInstructions);
  const selectedPath = useBoundStore((state) => state.selectedPath);
  const showLogin = useBoundStore((state) => state.showLogin);

  const { navPaths, isNavOpen, dstType } = useNavigationParams();
  const { hasAccess } = useUser();

  const [dst] = useQueryState("dst");

  const { navPaths, isNavOpen } = useNavigationParams();
  const { hasAccess } = useUser();

  // Process instructions
  useEffect(() => {
    const instructions = navPaths?.[selectedPath]?.instructions ?? [];
    const path: Node[] = navPaths?.[selectedPath]?.path.path ?? [];

    const newInstructions = [];

    let oldInstructionsIndex = 0;
    let distanceAcc = 0;
    path.forEach((node, index) => {
      if (node.id === instructions[oldInstructionsIndex]?.node_id) {
        const instruction = instructions[oldInstructionsIndex];
        if (instruction) instruction.distance = Math.round(distanceAcc);
        newInstructions.push(instruction);
        distanceAcc = 0;
        oldInstructionsIndex++;
      }

      if (
        index < path.length - 1 &&
        node.floor.buildingCode === "outside" &&
        path[index + 1]?.floor.buildingCode !== "outside"
      ) {
        newInstructions.push({
          action: "Enter",
          distance: Math.round(distanceAcc),
          node_id: node.id,
        });
        distanceAcc = 0;
      }
      if (
        index > 0 &&
        node.floor.buildingCode === "outside" &&
        path[index - 1]?.floor.buildingCode !== "outside"
      ) {
        newInstructions.push({
          action: "Exit",
          distance: Math.round(distanceAcc),
          node_id: node.id,
        });
        distanceAcc = 0;
      }

      if (index < path.length - 1) {
        const nextNode = path[index + 1];
        if (nextNode) {
          const distance = node.neighbors[nextNode.id]?.dist ?? 0;
          distanceAcc += distance;
        }
      }
    });

    newInstructions.push({
      action: "Forward",
      distance: Math.round(distanceAcc),
      node_id: path[path.length - 1]?.id ?? "",
    });
    newInstructions.push({
      action: "Arrive",
      distance: 0,
      node_id: path[path.length - 1]?.id ?? "",
    });
    setNavInstructions?.(newInstructions);
  }, [navPaths, setNavInstructions, selectedPath]);

  useEffect(() => {
    if (!isNavOpen) {
      endNav();
    }
  }, [isNavOpen, endNav]);

  // On page load, if the destination is a room and the user is not signed in, redirect to the login page
  // biome-ignore lint/correctness/useExhaustiveDependencies: should only fire on page load
  useEffect(() => {
    if (dst?.includes("-") && !hasAccess) {
      window.location.href = `${env.VITE_LOGIN_URL}?redirect_uri=${window.location.href}`;
    }
  }, []);

  if (!isNavOpen) {
    return;
  }

  if (isMobile) {
    return <NavOverlayMobile isNavigating={isNavigating} startNav={startNav} />;
  }
};

export default NavOverlay;
