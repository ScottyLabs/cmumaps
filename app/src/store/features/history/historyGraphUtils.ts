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

export const buildCreateNodeEditPair = (arg: CreateNodeArg): EditPair => {
  const { floorCode, nodeId } = arg;
  const edit: Edit = {
    endpoint: "createNode",
    arg: { ...arg, addToHistory: false },
  };
  const reverseEdit: Edit = {
    endpoint: "deleteNode",
    arg: { floorCode, nodeId, addToHistory: false },
  };
  return { edit, reverseEdit };
};

export const buildDeleteNodeEditPair = async (
  arg: DeleteNodeArg,
  getStore: () => RootState,
  dispatch: AppDispatch,
): Promise<EditPair> => {
  const { floorCode, nodeId } = arg;
  const edit: Edit = {
    endpoint: "deleteNode",
    arg: { ...arg, addToHistory: false },
  };

  const nodes = await getGraph(floorCode, getStore, dispatch);
  const reverseEdit: Edit = {
    endpoint: "createNode",
    arg: { floorCode, nodeId, nodeInfo: nodes[nodeId], addToHistory: false },
  };

  return { edit, reverseEdit };
};

export const buildUpdateNodeEditPair = async (
  arg: UpdateNodeArg,
  getStore: () => RootState,
  dispatch: AppDispatch,
): Promise<EditPair> => {
  const { floorCode, nodeId } = arg;
  const edit: Edit = {
    endpoint: "updateNode",
    arg: { ...arg, addToHistory: false },
  };

  const nodes = await getGraph(floorCode, getStore, dispatch);
  const reverseEdit: Edit = {
    endpoint: "updateNode",
    arg: { floorCode, nodeId, nodeInfo: nodes[nodeId], addToHistory: false },
  };

  return { edit, reverseEdit };
};

export const buildCreateEdgeEditPair = (arg: CreateEdgeArg): EditPair => {
  const edit: Edit = {
    endpoint: "createEdge",
    arg: { ...arg, addToHistory: false },
  };
  const reverseEdit: Edit = {
    endpoint: "deleteEdge",
    arg: { ...arg, addToHistory: false },
  };
  return { edit, reverseEdit };
};

export const buildDeleteEdgeEditPair = (arg: CreateEdgeArg): EditPair => {
  const edit: Edit = {
    endpoint: "deleteEdge",
    arg: { ...arg, addToHistory: false },
  };
  const reverseEdit: Edit = {
    endpoint: "createEdge",
    arg: { ...arg, addToHistory: false },
  };
  return { edit, reverseEdit };
};
