import { Nodes } from "../../../../../shared/types";
import { floorDataApiSlice } from "../../api/floorDataApiSlice";
import {
  CreateNodeArg,
  DeleteNodeArg,
  UpdateNodeArg,
} from "../../api/nodeApiSlice";
import { AppDispatch, RootState } from "../../store";
import { Edit, EditPair } from "./historyTypes";

const getNodes = async (
  floorCode: string,
  getStore: () => RootState,
  dispatch: AppDispatch,
) => {
  let nodes =
    floorDataApiSlice.endpoints.getFloorNodes.select(floorCode)(
      getStore(),
    ).data;

  if (!nodes) {
    nodes = (await dispatch(
      floorDataApiSlice.endpoints.getFloorNodes.initiate(floorCode),
    ).unwrap()) as Nodes;
  }

  return nodes;
};

export const buildCreateEditPair = (arg: CreateNodeArg): EditPair => {
  const { floorCode, nodeId } = arg;
  const edit: Edit = { endpoint: "createNode", arg };
  const reverseEdit: Edit = {
    endpoint: "deleteNode",
    arg: { floorCode, nodeId },
  };
  return { edit, reverseEdit };
};

export const buildDeleteEditPair = async (
  arg: DeleteNodeArg,
  getStore: () => RootState,
  dispatch: AppDispatch,
): Promise<EditPair> => {
  const { floorCode, nodeId } = arg;
  const edit: Edit = { endpoint: "deleteNode", arg };

  const nodes = await getNodes(floorCode, getStore, dispatch);
  const reverseEdit: Edit = {
    endpoint: "createNode",
    arg: { floorCode, nodeId, nodeInfo: nodes[nodeId] },
  };

  return { edit, reverseEdit };
};

export const buildUpdateEditPair = async (
  arg: UpdateNodeArg,
  getStore: () => RootState,
  dispatch: AppDispatch,
): Promise<EditPair> => {
  const { floorCode, nodeId } = arg;
  const edit: Edit = { endpoint: "updateNode", arg };

  const nodes = await getNodes(floorCode, getStore, dispatch);
  const reverseEdit: Edit = {
    endpoint: "updateNode",
    arg: { floorCode, nodeId, nodeInfo: nodes[nodeId] },
  };

  return { edit, reverseEdit };
};
