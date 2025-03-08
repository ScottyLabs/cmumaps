import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

import { toast } from "react-toastify";

import { useDeleteNodeMutation } from "../../../store/api/nodeApiSlice";
import {
  ADD_EDGE,
  DELETE_EDGE,
  setMode,
} from "../../../store/features/modeSlice";
import { useAppDispatch } from "../../../store/hooks";
import { RED_BUTTON_STYLE } from "../element-info/TableLayout";

interface Props {
  floorCode: string;
  nodeId: string;
}

const GraphInfoButtons = ({ floorCode, nodeId }: Props) => {
  const dispatch = useAppDispatch();
  const [deleteNode] = useDeleteNodeMutation();

  const renderButton = (
    text: string,
    handleClick: () => void,
    style?: string,
  ) => {
    return (
      <div>
        <button
          className={twMerge(
            "mb-2 rounded bg-slate-500 px-2 py-1 text-sm text-white hover:bg-slate-700",
            style,
          )}
          onClick={handleClick}
        >
          {text}
        </button>
      </div>
    );
  };

  const renderCopyNodeIdButton = () => {
    const copyId = () => {
      navigator.clipboard.writeText(nodeId);
      toast.success("Copied!");
    };

    return renderButton("Copy Node ID", copyId);
  };

  const renderDeleteNodeButton = () => {
    const deleteNodeHelper = () => {
      const batchId = uuidv4();
      deleteNode({ floorCode, nodeId, batchId });
    };
    return renderButton("Delete Node", deleteNodeHelper, RED_BUTTON_STYLE);
  };

  const renderAddEdgeByClickingButton = () => {
    const addEdge = () => dispatch(setMode(ADD_EDGE));
    return renderButton("Add Edge", addEdge);
  };

  const renderDeleteEdgeButton = () => {
    const deleteEdge = () => dispatch(setMode(DELETE_EDGE));
    return renderButton("Delete Edge", deleteEdge);
  };

  return (
    <div>
      <div className="flex space-x-4">
        {renderCopyNodeIdButton()}
        {renderDeleteNodeButton()}
      </div>
      <div className="flex space-x-4">
        {renderAddEdgeByClickingButton()}
        {renderDeleteEdgeButton()}
      </div>
    </div>
  );
};

export default GraphInfoButtons;
