import { useMemo } from "react";

import { EdgeInfo, Graph } from "../../../../../shared/types";
import CreateEdgeAcrossFloorsSection from "./CreateEdgeAcrossFloorsSection";
import CrossFloorNeighborTable from "./CrossFloorNeighborTable";
import GraphInfoButtons from "./GraphInfoButtons";

interface Props {
  floorCode: string;
  nodeId: string;
  // rooms: Rooms;
  graph: Graph;
}

const GraphInfoDisplay = ({ nodeId, floorCode, graph }: Props) => {
  const neighbors = graph[nodeId].neighbors;

  // calculate the same floor neighbors and different floor neighbors
  const differentFloorNeighbors = useMemo(() => {
    const differentFloorNeighbors: Record<string, EdgeInfo> = {};
    for (const neighborId in neighbors) {
      if (neighbors[neighborId].outFloorCode) {
        differentFloorNeighbors[neighborId] = neighbors[neighborId];
      }
    }

    return differentFloorNeighbors;
  }, [neighbors]);

  return (
    <>
      <div className="mb-1 space-y-4">
        <GraphInfoButtons floorCode={floorCode} nodeId={nodeId} />
        <CrossFloorNeighborTable
          floorCode={floorCode}
          nodeId={nodeId}
          neighbors={neighbors}
          differentFloorNeighbors={differentFloorNeighbors}
        />
        <CreateEdgeAcrossFloorsSection
          floorCode={floorCode}
          nodeId={nodeId}
          graph={graph}
        />
      </div>
    </>
  );
};

export default GraphInfoDisplay;
