import { Annotation, type Coordinate } from "mapkit-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import enterIcon from "@/assets/icons/nav/path/enter.svg";
import endIcon from "@/assets/icons/nav/path/pathEnd.svg";
import startIcon from "@/assets/icons/nav/path/pathStart.svg";
import useBoundStore from "@/store";
import type { Node } from "@/types/graphTypes";

interface IconInfo {
  coordinate: Coordinate;
  icon: { icon: string; offset?: { x: number; y: number } };
}

interface Props {
  map: mapkit.Map;
}

const Icons = {
  start: { icon: startIcon, offset: { x: 1, y: 2 } },
  end: { icon: endIcon, offset: { x: 12, y: 4 } },
  enter: { icon: enterIcon, offset: { x: 15, y: 5 } },
};

const NavLine = ({ map }: Props) => {
  //   const dispatch = useAppDispatch();
  const navPath = useBoundStore((state) => state.navPaths);

  const [curFloorPath, _setCurFloorPath] = useState<Node[] | null>(null);
  const [restPath, _setRestPath] = useState<Node[] | null>(null);

  const [pathOverlay, setPathOverlay] = useState<mapkit.PolylineOverlay[]>([]);
  const [iconInfos, setIconInfos] = useState<IconInfo[]>([]);

  const [src, _setSrc] = useQueryState("src");
  const [dst, _setDst] = useQueryState("dst");

  const fastestPath = navPath?.Fastest?.path.path;

  const recommendedPath = navPath;

  const path = fastestPath || [];
  const instructions = navPath?.Fastest?.instructions || [];

  const startedNavigation = false;

  useEffect(() => {
    if (startedNavigation) {
      const newPathOverlays: mapkit.PolylineOverlay[] = [];
      if (curFloorPath) {
        const curFloorPathOverlay = new mapkit.PolylineOverlay(
          curFloorPath.map(
            (n) =>
              new mapkit.Coordinate(
                n.coordinate.latitude,
                n.coordinate.longitude,
              ),
          ),
          {
            style: new mapkit.Style({
              strokeColor: "blue",
              strokeOpacity: 0.9,
              lineWidth: 5,
            }),
          },
        );

        newPathOverlays.push(curFloorPathOverlay);
      }

      if (restPath) {
        const restPathOverlay = new mapkit.PolylineOverlay(
          restPath.map(
            (n) =>
              new mapkit.Coordinate(
                n.coordinate.latitude,
                n.coordinate.longitude,
              ),
          ),
          {
            style: new mapkit.Style({
              strokeColor: "blue",
              strokeOpacity: 0.5,
              lineWidth: 5,
              lineDash: [10, 10],
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
        setPathOverlay(
          Object.values(recommendedPath).map((p, _) => {
            const style = {
              strokeColor: "blue",
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
      }
    }
  }, [restPath, curFloorPath, recommendedPath]);

  // render the polylines so they stay on top
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
  }, [map, pathOverlay, src, dst]);

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
        icon: Icons.start,
      });
      newIconInfos.push({
        // biome-ignore lint/style/noNonNullAssertion: path[path.length - 1] is guaranteed to exist
        coordinate: path[path.length - 1]!.coordinate,
        icon: Icons.end,
      });
    };

    const addInstructionIcons = () => {
      instructions.forEach((instruction) => {
        const coord = path.find(
          (n) => n.id === instruction.node_id,
        )?.coordinate;
        newIconInfos.push({
          coordinate: coord || { latitude: 0, longitude: 0 },
          icon: Icons.enter,
        });
      });
    };

    const newIconInfos: IconInfo[] = [];

    addInstructionIcons();
    addStartEndIcons();

    setIconInfos(newIconInfos);
    console.log("Icon Infos:", newIconInfos);
  }, [path.length, path[0], recommendedPath, instructions.forEach]);

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
        height={40}
        style={{
          height: "40px",
          transform: `translate(${iconInfo.icon.offset?.x ?? 0}px, ${iconInfo.icon.offset?.y ?? 0}px)`,
        }}
      />
    </Annotation>
  ));
};

export default NavLine;
