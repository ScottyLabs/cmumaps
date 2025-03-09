import { v4 as uuidv4 } from "uuid";

import { Graph, PoiInfo } from "../../../../../shared/types";
import { useUpdateNodeMutation } from "../../../store/api/nodeApiSlice";
import {
  useCreatePoiMutation,
  useDeletePoiMutation,
} from "../../../store/api/poiApiSlice";
import Button from "../shared/Button";

interface Props {
  floorCode: string;
  nodeId: string;
  graph: Graph;
}

const PoilessDisplay = ({ floorCode, nodeId, graph }: Props) => {
  const [createPoi] = useCreatePoiMutation();
  const [deletePoi] = useDeletePoiMutation();
  const [updateNode] = useUpdateNodeMutation();

  const handleCreatePoi = async () => {
    const poiId = uuidv4();
    const poiInfo: PoiInfo = { type: "", nodeId };
    const batchId = uuidv4();
    const poiRes = await createPoi({ floorCode, poiId, poiInfo, batchId });
    if (poiRes.error) {
      console.error("Error creating POI", poiRes.error);
      return;
    }

    const nodeInfo = { ...graph[nodeId] };
    const nodeRes = await updateNode({ floorCode, nodeId, nodeInfo, batchId });
    if (nodeRes.error) {
      console.error("Error updating node", nodeRes.error);
      try {
        await deletePoi({ floorCode, poiId, batchId: null });
      } catch (rollbackError) {
        console.error("Failed to roll back POI creation", rollbackError);
      }
      return;
    }
  };

  return <Button text="Create POI" handleClick={handleCreatePoi} />;
};

export default PoilessDisplay;
