import { Annotation, type Coordinate } from "mapkit-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import enterIcon from "@/assets/icons/nav/path/enter.svg";
import enterCompletedIcon from "@/assets/icons/nav/path/enter-completed.svg";
import exitIcon from "@/assets/icons/nav/path/exit.svg";
import exitCompletedIcon from "@/assets/icons/nav/path/exit-completed.svg";
import endIcon from "@/assets/icons/nav/path/pathEnd.svg";
import startIcon from "@/assets/icons/nav/path/pathStart.svg";
import startIconCompleted from "@/assets/icons/nav/path/pathStart-completed.svg";
import useNavPaths from "@/hooks/useNavPaths";
import useBoundStore from "@/store";
import type { Node } from "@/types/navTypes";

interface IconInfo {
  coordinate: Coordinate;
  icon: { icon: string; offset?: { x: number; y: number } };
}

interface Props {
  map: mapkit.Map;
}

const standardOffset = { x: 20, y: 8 };
const PathInstructionIcons: Record<
  string,
  { icon: string; offset?: { x: number; y: number } }
> = {
  Start: { icon: startIcon, offset: { x: 0, y: 0 } },
  StartCompleted: { icon: startIconCompleted, offset: { x: 0, y: 0 } },
  Enter: { icon: enterIcon, offset: standardOffset },
  EnterCompleted: { icon: enterCompletedIcon, offset: standardOffset },
  Exit: { icon: exitIcon, offset: standardOffset },
  ExitCompleted: { icon: exitCompletedIcon, offset: standardOffset },
};
const EndIcon = { icon: endIcon, offset: { x: 12, y: 4 } };

const NavLine = ({ map }: Props) => {
  //   const dispatch = useAppDispatch();
  const [completedPath, setCompletedPath] = useState<Node[] | null>(null);
  const [uncompletedPath, setUncompletedPath] = useState<Node[] | null>(null);

  const [pathOverlay, setPathOverlay] = useState<mapkit.Overlay[]>([]);
  const [iconInfos, setIconInfos] = useState<IconInfo[]>([]);

  const [src, _setSrc] = useQueryState("src");
  const [dst, _setDst] = useQueryState("dst");

  const focusedFloor = useBoundStore((state) => state.focusedFloor);

  const navPaths = useNavPaths(src, dst);

  const fastestPath = navPaths?.Fastest?.path.path;

  const instructionIndex = useBoundStore((state) => state.navInstructionIndex);

  const recommendedPath = navPaths;

  const path = fastestPath || [];
  const instructions = useBoundStore((state) => state.navInstructions) ?? [];

  const startedNavigation = useBoundStore((state) => state.isNavigating);

  // calculate curFloorPath and restPath
  useEffect(() => {
    if (startedNavigation) {
      const path: Node[] = fastestPath || [];
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
    fastestPath,
    instructions[instructionIndex]?.node_id,
    startedNavigation,
  ]);

  useEffect(() => {
    const newPathOverlays: mapkit.Overlay[] = [];

    if (startedNavigation) {
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
  }, [recommendedPath, completedPath, startedNavigation, uncompletedPath]);

  // render the polylines so they stay on top
  // biome-ignore lint/correctness/useExhaustiveDependencies: Re-render whenever new floor is focused so line is not covered
  useEffect(() => {
    if (pathOverlay) {
      if (dst && src && dst !== "" && src !== "") {
        map.addOverlays(pathOverlay);
      } else {
        map.removeOverlays(pathOverlay);
      }
    }

    return () => {
      if (pathOverlay) {
        map.removeOverlays(pathOverlay);
      }
    };
  }, [map, pathOverlay, src, dst, focusedFloor]);

  // calculate the icons (annotations)
  useEffect(() => {
    if (!recommendedPath) {
      setIconInfos([]);
      return;
    }

    const addStartEndIcons = () => {
      console.log(path);
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
    console.log("Icon Infos:", newIconInfos);
  }, [
    path.length,
    path[0],
    recommendedPath,
    instructions.forEach,
    instructionIndex,
  ]);

  if (!dst || dst === "") {
    return;
  }

  return iconInfos.map((iconInfo, index) => (
    <Annotation
      key={index}
      latitude={iconInfo.coordinate.latitude}
      longitude={iconInfo.coordinate.longitude}
      displayPriority={"required"}
    >
      <img
        src={iconInfo.icon.icon}
        alt="Icon"
        // height={40}
        style={{
          // height: "40px",
          transform: `translate(${iconInfo.icon.offset?.x ?? 0}px, ${iconInfo.icon.offset?.y ?? 0}px)`,
        }}
      />
    </Annotation>
  ));
};

export default NavLine;
