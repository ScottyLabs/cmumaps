import { Nodes } from "../../../../../shared/types";
import {
  CreateNodeArg,
  DeleteNodeArg,
  nodeApiSlice,
} from "../../api/nodeApiSlice";
import { AppDispatch, RootState } from "../../store";
import { Edit, EditPair } from "./historyTypes";

const getNodes = async (
  floorCode: string,
  getStore: () => RootState,
  dispatch: AppDispatch,
) => {
  let nodes =
    nodeApiSlice.endpoints.getFloorNodes.select(floorCode)(getStore()).data;

  if (!nodes) {
    nodes = (await dispatch(
      nodeApiSlice.endpoints.getFloorNodes.initiate(floorCode),
    ).unwrap()) as Nodes;
  }

  return nodes;
};

export const buildCreateEditPair = (arg: CreateNodeArg): EditPair => {
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

export const buildDeleteEditPair = async (
  arg: DeleteNodeArg,
  getStore: () => RootState,
  dispatch: AppDispatch,
): Promise<EditPair> => {
  const { socketId, floorCode, nodeId } = arg;
  const edit: Edit = {
    endpoint: "deleteNode",
    arg,
  };

  const nodes = await getNodes(floorCode, getStore, dispatch);
  console.log(nodes);
  console.log(nodes[nodeId]);
  const reverseEdit: Edit = {
    endpoint: "createNode",
    arg: {
      socketId,
      floorCode,
      nodeId,
      nodeInfo: nodes[nodeId],
    },
  };
  return { edit, reverseEdit };
};
