import { Annotation, type Coordinate } from "mapkit-react";
import { useEffect, useState } from "react";
import enterIcon from "@/assets/icons/nav/path/enter.svg";
import enterCompletedIcon from "@/assets/icons/nav/path/enter-completed.svg";
import exitIcon from "@/assets/icons/nav/path/exit.svg";
import exitCompletedIcon from "@/assets/icons/nav/path/exit-completed.svg";
import endIcon from "@/assets/icons/nav/path/pathEnd.svg";
import startIcon from "@/assets/icons/nav/path/pathStart.svg";
import startIconCompleted from "@/assets/icons/nav/path/pathStart-completed.svg";
import useNavigationParams from "@/hooks/useNavigationParams";
import useBoundStore from "@/store";
import type { Node } from "@/types/navTypes";
import { zoomOnPoint } from "@/utils/zoomUtils";

interface IconInfo {
  coordinate: Coordinate;
  icon: { icon: string; offset?: { x: number; y: number }; height?: number };
}

interface Props {
  map: mapkit.Map | null;
}

const standardOffset = { x: 16, y: 8 };
const PathInstructionIcons: Record<
  string,
  { icon: string; offset?: { x: number; y: number }; height?: number }
> = {
  Start: { icon: startIcon, offset: { x: 0, y: 8 } },
  StartCompleted: { icon: startIconCompleted, offset: { x: 0, y: 8 } },
  Enter: { icon: enterIcon, offset: standardOffset, height: 40 },
  EnterCompleted: {
    icon: enterCompletedIcon,
    offset: standardOffset,
    height: 40,
  },
  Exit: { icon: exitIcon, offset: standardOffset, height: 40 },
  ExitCompleted: {
    icon: exitCompletedIcon,
    offset: standardOffset,
    height: 40,
  },
};
const EndIcon = { icon: endIcon, offset: { x: 15, y: 4 } };

const NavLine = ({ map }: Props) => {
  //   const dispatch = useAppDispatch();
  const [completedPath, setCompletedPath] = useState<Node[] | null>(null);
  const [uncompletedPath, setUncompletedPath] = useState<Node[] | null>(null);

  const [pathOverlay, setPathOverlay] = useState<mapkit.PolylineOverlay[]>([]);
  const [iconInfos, setIconInfos] = useState<IconInfo[]>([]);

  const { navPaths, isNavOpen } = useNavigationParams();

  const instructionIndex = useBoundStore((state) => state.navInstructionIndex);
  const isNavigating = useBoundStore((state) => state.isNavigating);
  const selectedPath = useBoundStore((state) => state.selectedPath);
  const setIsZooming = useBoundStore((state) => state.setIsZooming);
  const setQueuedZoomRegion = useBoundStore(
    (state) => state.setQueuedZoomRegion,
  );
  const focusFloor = useBoundStore((state) => state.focusFloor);

  const path = navPaths?.[selectedPath]?.path.path ?? [];

  const recommendedPath = navPaths;

  const instructions = useBoundStore((state) => state.navInstructions) ?? [];

  // zoom on current instruction and focus the corresponding floor
  useEffect(() => {
    if (isNavigating && map) {
      const node =
        instructionIndex === 0
          ? navPaths?.[selectedPath]?.path.path[0]
          : navPaths?.[selectedPath]?.path.path.find(
              (n) => n.id === instructions[instructionIndex - 1]?.node_id,
            );
      if (node) {
        focusFloor(node.floor);
      }
      if (node?.coordinate) {
        zoomOnPoint(
          map,
          node.coordinate,
          0.0004,
          setIsZooming,
          setQueuedZoomRegion,
        );
      }
    }
  }, [
    isNavigating,
    instructionIndex,
    focusFloor,
    instructions[instructionIndex - 1]?.node_id,
    map,
    navPaths?.[selectedPath]?.path.path.find,
    setIsZooming,
    navPaths?.[selectedPath]?.path.path[0],
    setQueuedZoomRegion,
    selectedPath,
  ]);

  // calculate curFloorPath and restPath
  useEffect(() => {
    if (isNavigating) {
      const newFinishedPath: Node[] = [];
      const newUnfinishedPath: Node[] = [];

      const currentNodeid =
        instructionIndex > 0
          ? instructions[instructionIndex - 1]?.node_id
          : path[0]?.id;

      let reachedCurrentNode = false;
      for (const node of path) {
        if (reachedCurrentNode) {
          newUnfinishedPath.push(node);
        } else {
          newFinishedPath.push(node);
        }

        if (node.id === currentNodeid) {
          reachedCurrentNode = true;
          newUnfinishedPath.push(node);
        }
      }

      setCompletedPath(newFinishedPath);
      setUncompletedPath(newUnfinishedPath);
    }
  }, [
    instructionIndex,
    instructions[instructionIndex]?.node_id,
    isNavigating,
    path,
  ]);

  useEffect(() => {
    const newPathOverlays: mapkit.PolylineOverlay[] = [];

    if (isNavigating) {
      if (completedPath) {
        const curFloorPathOverlay = new mapkit.PolylineOverlay(
          completedPath.map(
            (n) =>
              new mapkit.Coordinate(
                n.coordinate.latitude,
                n.coordinate.longitude,
              ),
          ),
          {
            style: new mapkit.Style({
              strokeColor: "grey",
              strokeOpacity: 0.5,
              lineWidth: 5,
            }),
          },
        );

        newPathOverlays.push(curFloorPathOverlay);
      }

      if (uncompletedPath) {
        const restPathOverlay = new mapkit.PolylineOverlay(
          uncompletedPath.map(
            (n) =>
              new mapkit.Coordinate(
                n.coordinate.latitude,
                n.coordinate.longitude,
              ),
          ),
          {
            style: new mapkit.Style({
              strokeColor: "#3D83D3",
              strokeOpacity: 0.9,
              lineWidth: 5,
              //   lineDash: [10, 10],
            }),
          },
        );

        newPathOverlays.push(restPathOverlay);
      }

      setPathOverlay(newPathOverlays);
    } else {
      if (!recommendedPath) {
        setPathOverlay([]);
      } else {
        newPathOverlays.push(
          ...Object.values(recommendedPath).map((p, _) => {
            const style = {
              strokeColor: "#3D83D3",
              strokeOpacity: 0.9,
              lineWidth: 5,
            };

            return new mapkit.PolylineOverlay(
              p.path.path.map(
                (n) =>
                  new mapkit.Coordinate(
                    n.coordinate.latitude,
                    n.coordinate.longitude,
                  ),
              ),
              { style: new mapkit.Style(style) },
            );
          }),
        );

        setPathOverlay(newPathOverlays);
      }
    }
  }, [recommendedPath, completedPath, isNavigating, uncompletedPath]);

  // render the polylines so they stay on top
  // biome-ignore lint/correctness/useExhaustiveDependencies: Re-render whenever new floor is focused so line is not covered
  useEffect(() => {
    if (pathOverlay) {
      if (isNavOpen) {
        map?.addOverlays(pathOverlay);
      } else {
        map?.removeOverlays(pathOverlay);
      }
    }

    return () => {
      if (pathOverlay) {
        map?.removeOverlays(pathOverlay);
      }
    };
  }, [map, map?.overlays, map?.selectedAnnotation, pathOverlay, isNavOpen]);

  // calculate the icons (annotations)
  useEffect(() => {
    if (!recommendedPath) {
      setIconInfos([]);
      return;
    }

    const addStartEndIcons = () => {
      if (path.length === 0) return;
      newIconInfos.push({
        // biome-ignore lint/style/noNonNullAssertion: path[0] is guaranteed to exist
        coordinate: path[0]!.coordinate,
        // biome-ignore lint/style/noNonNullAssertion: PathInstructionIcons always contains both Start and StartCompleted
        icon: PathInstructionIcons[
          instructionIndex === 0 ? "Start" : "StartCompleted"
        ]!,
      });
      newIconInfos.push({
        // biome-ignore lint/style/noNonNullAssertion: path[path.length - 1] is guaranteed to exist
        coordinate: path[path.length - 1]!.coordinate,
        icon: EndIcon,
      });
    };

    const addInstructionIcons = () => {
      instructions.forEach((instruction, i) => {
        const coord = path.find(
          (n) => n.id === instruction.node_id,
        )?.coordinate;
        const isCompleted = instructionIndex > i;
        if (PathInstructionIcons[instruction.action]) {
          newIconInfos.push({
            coordinate: coord || { latitude: 0, longitude: 0 },
            icon: PathInstructionIcons[
              isCompleted
                ? `${instruction.action}Completed`
                : instruction.action
            ] ?? { icon: "" },
          });
        }
      });
    };

    const newIconInfos: IconInfo[] = [];

    addInstructionIcons();
    addStartEndIcons();

    setIconInfos(newIconInfos);
  }, [
    path.length,
    path[0],
    recommendedPath,
    instructions.forEach,
    instructionIndex,
  ]);

  if (!isNavOpen || !map) {
    return;
  }

  return (
    <>
      {iconInfos.map((iconInfo, index) => (
        <Annotation
          key={index}
          latitude={iconInfo.coordinate.latitude}
          longitude={iconInfo.coordinate.longitude}
          displayPriority={"required"}
        >
          <img
            src={iconInfo.icon.icon}
            alt="Icon"
            style={{
              height: iconInfo.icon.height,
              transform: `translate(${iconInfo.icon.offset?.x ?? 0}px, ${iconInfo.icon.offset?.y ?? 0}px)`,
            }}
          />
        </Annotation>
      ))}
    </>
  );
};

export default NavLine;
