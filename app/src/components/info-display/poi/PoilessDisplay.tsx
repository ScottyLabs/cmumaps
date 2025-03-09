import { v4 as uuidv4 } from "uuid";

import { Graph, PoiInfo } from "../../../../../shared/types";
import { useUpdateNodeMutation } from "../../../store/api/nodeApiSlice";
import { useCreatePoiMutation } from "../../../store/api/poiApiSlice";
import Button from "../shared/Button";

interface Props {
  floorCode: string;
  nodeId: string;
  graph: Graph;
}

const PoilessDisplay = ({ floorCode, nodeId, graph }: Props) => {
  const [createPoi] = useCreatePoiMutation();
  const [updateNode] = useUpdateNodeMutation();

  const handleCreatePoi = async () => {
    const poiId = uuidv4();
    const poiInfo: PoiInfo = { type: "", nodeId };
    const batchId = uuidv4();
    await createPoi({ floorCode, poiId, poiInfo, batchId });

    const nodeInfo = { ...graph[nodeId] };
    await updateNode({ floorCode, nodeId, nodeInfo, batchId });
  };

  return <Button text="Create POI" handleClick={handleCreatePoi} />;
};

export default PoilessDisplay;
