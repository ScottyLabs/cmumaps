import type { Graph } from "@cmumaps/common";
import { extractBuildingCode } from "@cmumaps/common";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { useGetBuildingFloorsQuery } from "../../../store/api/buildingApiSlice";
import { useCreateEdgeAcrossFloorsMutation } from "../../../store/api/edgeApiSlice";
import { setShortcutsDisabled } from "../../../store/features/statusSlice";
import { useAppDispatch } from "../../../store/hooks";
import InfoDisplayButton from "../shared/InfoDisplayButton";

interface Props {
  floorCode: string;
  nodeId: string;
  graph: Graph;
}

const CrossFloorEdgeSection = ({ floorCode, nodeId, graph }: Props) => {
  const dispatch = useAppDispatch();
  const buildingCode = extractBuildingCode(floorCode);
  const { data: floorLevels } = useGetBuildingFloorsQuery(buildingCode);

  const [createEdgeAcrossFloors] = useCreateEdgeAcrossFloorsMutation();

  const [toFloorCode, setToFloorCode] = useState("");
  const nodeIdRef = useRef<HTMLInputElement | null>(null);

  if (!floorLevels) {
    return;
  }

  const addEdgeWithId = async () => {
    const validate = () => {
      const inNodeId = nodeId;

      // This condition should never occur because graph info is only displayed
      // when a node is selected
      if (!inNodeId) {
        return { error: "Please select a node first!" };
      }

      const outNodeId = nodeIdRef.current?.value;
      if (!outNodeId) {
        return { error: "Please input node id!" };
      }

      // check multi-edge
      if (outNodeId in graph[nodeId].neighbors) {
        return { error: "Edge already existed!" };
      }

      if (!toFloorCode) {
        return { error: "Select a Floor!" };
      }

      return { valid: true, inNodeId, outNodeId };
    };

    const validateRes = validate();
    if (!validateRes.valid) {
      toast.error(validateRes.error);
      return;
    }

    const { inNodeId, outNodeId } = validateRes;
    createEdgeAcrossFloors({
      floorCode,
      outFloorCode: toFloorCode,
      inNodeId,
      outNodeId,
      batchId: uuidv4(),
    });

    // clear inputs
    setToFloorCode("");
    if (nodeIdRef.current) {
      nodeIdRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1">
      <div>
        <p className="text-lg">Create Edge across Floors</p>
      </div>
      <div className="mb-3 space-y-2">
        <div>
          <input
            ref={nodeIdRef}
            placeholder="Node ID"
            className="rounded bg-white px-2 text-black"
            onFocus={() => dispatch(setShortcutsDisabled(true))}
            onBlur={() => dispatch(setShortcutsDisabled(false))}
          />
        </div>
      </div>
      <InfoDisplayButton
        text="Add Edge Across Floors"
        handleClick={addEdgeWithId}
      />
    </div>
  );
};

export default CrossFloorEdgeSection;
