import { v4 as uuidv4 } from "uuid";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";

import { Graph } from "../../../../../shared/types";
import { extractBuildingCode } from "../../../../../shared/utils/floorCodeUtils";
import { useGetBuildingFloorsQuery } from "../../../store/api/buildingApiSlice";
import { useCreateEdgeAcrossFloorsMutation } from "../../../store/api/edgeApiSlice";
import { setShortcutsDisabled } from "../../../store/features/statusSlice";
import { useAppDispatch } from "../../../store/hooks";

interface Props {
  floorCode: string;
  graph: Graph;
}

const CreateEdgeAcrossFloorsSection = ({ floorCode, graph }: Props) => {
  const dispatch = useAppDispatch();
  const buildingCode = extractBuildingCode(floorCode);
  const { data: floorLevels } = useGetBuildingFloorsQuery(buildingCode);

  const [createEdgeAcrossFloors] = useCreateEdgeAcrossFloorsMutation();

  const [searchParam] = useSearchParams();
  const nodeId = searchParam.get("nodeId");

  const [toFloorCode, setToFloorCode] = useState("");
  const nodeIdRef = useRef<HTMLInputElement | null>(null);

  const connectedFloors = useMemo(() => {
    if (!floorLevels) {
      return [];
    }
    const buildingCode = extractBuildingCode(floorCode);
    const connectedFloors: string[] = [];

    // include floor above and below if possible
    const floorsArr = floorCode.split("-");
    const floorIndex = floorLevels.indexOf(floorsArr[floorsArr.length - 1]);
    const prefix = buildingCode + "-";
    if (floorIndex != floorLevels.length - 1) {
      connectedFloors.push(prefix + floorLevels[floorIndex + 1]);
    }
    if (floorIndex != 0) {
      connectedFloors.push(prefix + floorLevels[floorIndex - 1]);
    }

    // always include outside
    connectedFloors.push("outside");

    // TODO: add connected buildings
    return connectedFloors;
  }, [floorCode, floorLevels]);

  if (!floorLevels) {
    return;
  }

  const addEdgeWithID = async () => {
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

  const renderFloorSelector = () => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setToFloorCode(event.target.value);
    };

    return (
      <div>
        <select
          name="floor"
          id="floor"
          className="rounded bg-white text-black"
          value={toFloorCode}
          onChange={handleChange}
        >
          <option value="" disabled>
            --Please choose a floor--
          </option>
          {connectedFloors.map((floor) => (
            <option key={floor} value={floor}>
              {floor}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderCreateButton = () => {
    return (
      <div>
        <button
          className="my-1 rounded bg-slate-500 px-2 py-1 text-sm text-white hover:bg-slate-700"
          onClick={addEdgeWithID}
        >
          Create
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center space-x-3">
        <p>Create Edge across Floors</p>
        {renderCreateButton()}
      </div>
      <div className="space-y-2">
        {renderFloorSelector()}
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
    </div>
  );
};

export default CreateEdgeAcrossFloorsSection;
