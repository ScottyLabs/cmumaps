import { useMemo } from "react";
import { useSearchParams } from "react-router";

import { EdgeInfo, Graph } from "../../../../../shared/types";
// import AddEdgeAcrossFloorsSection from "./AddEdgeAcrossFloorsSection";
import CrossFloorNeighborTable from "./CrossFloorNeighborTable";
import GraphInfoButtons from "./GraphInfoButtons";

interface Props {
  floorCode: string;
  // rooms: Rooms;
  graph: Graph;
}

const GraphInfoDisplay = ({ floorCode, graph }: Props) => {
  const [searchParam] = useSearchParams();
  const nodeId = searchParam.get("nodeId");

  // get neighbors of the node
  const neighbors = useMemo(() => {
    if (nodeId && graph) {
      return graph[nodeId]?.neighbors || {};
    }
    return {};
  }, [nodeId, graph]);

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

  if (!nodeId) {
    return;
  }

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
        {/* <AddEdgeAcrossFloorsSection floorCode={floorCode} nodes={graph} /> */}
      </div>
    </>
  );
};

export default GraphInfoDisplay;
