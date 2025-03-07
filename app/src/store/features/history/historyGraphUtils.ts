import { Graph } from "../../../../../shared/types";
import { CreateEdgeArg } from "../../api/edgeApiSlice";
import { floorDataApiSlice } from "../../api/floorDataApiSlice";
import {
  CreateNodeArg,
  DeleteNodeArg,
  UpdateNodeArg,
} from "../../api/nodeApiSlice";
import { AppDispatch, RootState } from "../../store";
import { Edit, EditPair } from "./historyTypes";

const getGraph = async (
  floorCode: string,
  getStore: () => RootState,
  dispatch: AppDispatch,
) => {
  let nodes =
    floorDataApiSlice.endpoints.getFloorGraph.select(floorCode)(
      getStore(),
    ).data;

  if (!nodes) {
    nodes = (await dispatch(
      floorDataApiSlice.endpoints.getFloorGraph.initiate(floorCode),
    ).unwrap()) as Graph;
  }

  return nodes;
};

export const buildCreateNodeEditPair = (
  batchId: string,
  arg: CreateNodeArg,
): EditPair => {
  const { floorCode, nodeId } = arg;
  const edit: Edit = {
    endpoint: "createNode",
    arg: { ...arg, batchId: null },
  };
  const reverseEdit: Edit = {
    endpoint: "deleteNode",
    arg: { floorCode, nodeId, batchId: null },
  };
  return { batchId, edit, reverseEdit };
};

export const buildDeleteNodeEditPair = async (
  batchId: string,
  arg: DeleteNodeArg,
  getStore: () => RootState,
  dispatch: AppDispatch,
): Promise<EditPair> => {
  const { floorCode, nodeId } = arg;
  const edit: Edit = {
    endpoint: "deleteNode",
    arg: { ...arg, batchId: null },
  };

  const nodes = await getGraph(floorCode, getStore, dispatch);
  const reverseEdit: Edit = {
    endpoint: "createNode",
    arg: { floorCode, nodeId, nodeInfo: nodes[nodeId], batchId: null },
  };

  return { batchId, edit, reverseEdit };
};

export const buildUpdateNodeEditPair = async (
  batchId: string,
  arg: UpdateNodeArg,
  getStore: () => RootState,
  dispatch: AppDispatch,
): Promise<EditPair> => {
  const { floorCode, nodeId } = arg;
  const edit: Edit = {
    endpoint: "updateNode",
    arg: { ...arg, batchId: null },
  };

  const nodes = await getGraph(floorCode, getStore, dispatch);
  const reverseEdit: Edit = {
    endpoint: "updateNode",
    arg: { floorCode, nodeId, nodeInfo: nodes[nodeId], batchId: null },
  };

  return { batchId, edit, reverseEdit };
};

export const buildCreateEdgeEditPair = (
  batchId: string,
  arg: CreateEdgeArg,
): EditPair => {
  const edit: Edit = {
    endpoint: "createEdge",
    arg: { ...arg, batchId: null },
  };
  const reverseEdit: Edit = {
    endpoint: "deleteEdge",
    arg: { ...arg, batchId: null },
  };
  return { batchId, edit, reverseEdit };
};

export const buildDeleteEdgeEditPair = (
  batchId: string,
  arg: CreateEdgeArg,
): EditPair => {
  const edit: Edit = {
    endpoint: "deleteEdge",
    arg: { ...arg, batchId: null },
  };
  const reverseEdit: Edit = {
    endpoint: "createEdge",
    arg: { ...arg, batchId: null },
  };
  return { batchId, edit, reverseEdit };
};
