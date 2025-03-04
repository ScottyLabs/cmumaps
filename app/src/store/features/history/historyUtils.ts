import { CreateNodeArg } from "../../api/nodeApiSlice";
import { Edit, EditPair } from "./historyTypes";

export const generateCreateEditPair = (arg: CreateNodeArg): EditPair => {
  const { socketId, floorCode, nodeId } = arg;
  const edit: Edit = {
    endpoint: "createNode",
    arg,
  };
  const reverseEdit: Edit = {
    endpoint: "deleteNode",
    arg: {
      socketId,
      floorCode,
      nodeId,
    },
  };
  return { edit, reverseEdit };
};
