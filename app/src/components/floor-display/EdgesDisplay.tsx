import { useMemo } from "react";
import { Line } from "react-konva";

import { Graph } from "../../../../shared/types";
import { selectEditPolygon } from "../../store/features/modeSlice";
import { useAppSelector } from "../../store/hooks";

interface Props {
  graph: Graph;
}

const EdgesDisplay = ({ graph }: Props) => {
  const nodeSize = useAppSelector((state) => state.ui.nodeSize);
  const nodeIdOnDrag = useAppSelector((state) => state.mouseEvent.dragNodeId);
  const dragNodePos = useAppSelector((state) => state.mouseEvent.dragNodePos);
  const showEdges = useAppSelector((state) => state.visibility.showEdges);
  const editPolygon = useAppSelector(selectEditPolygon);
  const editRoomLabel = useAppSelector((state) => state.ui.editRoomLabel);

  const edges: [number[], string][] = useMemo(() => {
    const includedNodes = new Set();
    const shouldRender = (_curId: string, neighborId: string) => {
      // don't display an edge twice
      if (includedNodes.has(neighborId)) {
        return false;
      }

      // don't display edge that connect to a different floor
      if (!graph[neighborId]) {
        return false;
      }

      // logic for displaying room specific edges
      // if (showRoomSpecific && nodes[curId].roomId !== roomIdSelected) {
      //   return false;
      // }

      return true;
    };

    const edges: [number[], string][] = [];
    for (const curId in graph) {
      for (const neighborId in graph[curId].neighbors) {
        if (shouldRender(curId, neighborId)) {
          const line = [
            graph[curId].pos.x,
            graph[curId].pos.y,
            graph[neighborId].pos.x,
            graph[neighborId].pos.y,
          ];

          // update with dragging information if needed
          if (curId === nodeIdOnDrag && dragNodePos) {
            line[0] = dragNodePos.x;
            line[1] = dragNodePos.y;
          }

          if (neighborId === nodeIdOnDrag && dragNodePos) {
            line[2] = dragNodePos.x;
            line[3] = dragNodePos.y;
          }

          edges.push([line, "green"]);
        }
      }
      includedNodes.add(curId);
    }

    return edges;
  }, [dragNodePos, graph, nodeIdOnDrag]);

  if (!showEdges || editPolygon || editRoomLabel) {
    return;
  }

  return edges.map(([points, color], index: number) => {
    return (
      <Line
        key={index}
        points={points}
        stroke={color}
        strokeWidth={nodeSize / 2}
      />
    );
  });
};

export default EdgesDisplay;
