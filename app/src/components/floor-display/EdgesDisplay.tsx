import { useMemo } from "react";
import { Line } from "react-konva";

import { Graph, ID } from "../../../../shared/types";
import { useAppSelector } from "../../store/hooks";

interface Props {
  graph: Graph;
}

const EdgesDisplay = ({ graph }: Props) => {
  const nodeSize = useAppSelector((state) => state.ui.nodeSize);

  const edges: [number[], string][] = useMemo(() => {
    const includedNodes = new Set();
    const shouldRender = (_curId: ID, neighborId: ID) => {
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
          // if (curId === nodeIdOnDrag) {
          //   const cursorPos =
          //     cursorInfoListRef.current[cursorInfoListRef.current.length - 1];
          //   if (cursorPos && "nodePos" in cursorPos) {
          //     line[0] = cursorPos.nodePos.x;
          //     line[1] = cursorPos.nodePos.y;
          //   }
          // }

          // if (neighborId === nodeIdOnDrag) {
          //   const cursorPos =
          //     cursorInfoListRef.current[cursorInfoListRef.current.length - 1];
          //   if (cursorPos && "nodePos" in cursorPos) {
          //     line[2] = cursorPos.nodePos.x;
          //     line[3] = cursorPos.nodePos.y;
          //   }
          // }

          edges.push([line, "green"]);
        }
      }
      includedNodes.add(curId);
    }

    return edges;
  }, [graph]);

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
