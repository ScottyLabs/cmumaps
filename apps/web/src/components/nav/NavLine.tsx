import { Annotation, type Coordinate } from "mapkit-react";
import { useEffect, useState } from "react";
import endIcon from "@/assets/icons/nav/path/pathEnd.svg";
import startIcon from "@/assets/icons/nav/path/pathStart.svg";

interface IconInfo {
  coordinate: Coordinate;
  icon: string;
  offset?: { x: number; y: number };
}
interface Node {
  coordinate: { latitude: number; longitude: number };
}
interface Props {
  map: mapkit.Map;
}

const NavLine = ({ map }: Props) => {
  //   const dispatch = useAppDispatch();

  const [curFloorPath, _setCurFloorPath] = useState<Node[] | null>(null);
  const [restPath, _setRestPath] = useState<Node[] | null>(null);

  const [pathOverlay, setPathOverlay] = useState<mapkit.PolylineOverlay[]>([]);
  const [iconInfos, setIconInfos] = useState<IconInfo[]>([]);

  const recommendedPath = [
    {
      path: [
        {
          coordinate: {
            latitude: 40.441598163584466,
            longitude: -79.94164604686353,
          },
        },
        {
          coordinate: {
            latitude: 40.44053789673255,
            longitude: -79.94242929024519,
          },
        },
      ],
    },
  ];

  const path: Node[] = [
    {
      coordinate: {
        latitude: 40.441598163584466,
        longitude: -79.94164604686353,
      },
    },
    {
      coordinate: {
        latitude: 40.44053789673255,
        longitude: -79.94242929024519,
      },
    },
  ];

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
          recommendedPath.map((p, _) => {
            const style = {
              strokeColor: "blue",
              strokeOpacity: 0.9,
              lineWidth: 5,
            };

            return new mapkit.PolylineOverlay(
              p.path.map(
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
  }, [
    // recommendedPath,
    restPath,
    curFloorPath,
    // selectedPathNum,
    // startedNavigation,
  ]);

  // render the polylines so they stay on top
  useEffect(() => {
    if (pathOverlay) {
      map.addOverlays(pathOverlay);
    }

    return () => {
      if (pathOverlay) {
        map.removeOverlays(pathOverlay);
      }
    };
  }, [map, pathOverlay]);

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
        icon: startIcon,
        offset: { x: 1, y: 2 },
      });
      newIconInfos.push({
        // biome-ignore lint/style/noNonNullAssertion: path[path.length - 1] is guaranteed to exist
        coordinate: path[path.length - 1]!.coordinate,
        icon: endIcon,
        offset: { x: 12, y: 4 },
      });
    };

    const newIconInfos: IconInfo[] = [];

    addStartEndIcons();

    setIconInfos(newIconInfos);
    console.log("Icon Infos:", newIconInfos);
  }, []);

  return iconInfos.map((iconInfo, index) => (
    <Annotation
      key={index}
      latitude={iconInfo.coordinate.latitude}
      longitude={iconInfo.coordinate.longitude}
      displayPriority={"required"}
    >
      <img
        src={iconInfo.icon}
        alt="Icon"
        height={40}
        style={{
          height: "40px",
          transform: `translate(${iconInfo.offset?.x ?? 0}px, ${iconInfo.offset?.y ?? 0}px)`,
        }}
      />
    </Annotation>
  ));
};

export default NavLine;
