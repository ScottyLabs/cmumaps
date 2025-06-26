import type { NodeInfo } from "../types";

export interface CreateNodePayload {
  nodeId: string;
  nodeInfo: NodeInfo;
}

export interface DeleteNodePayload {
  nodeId: string;
}

export interface UpdateNodePayload {
  nodeId: string;
  nodeInfo: NodeInfo;
}
