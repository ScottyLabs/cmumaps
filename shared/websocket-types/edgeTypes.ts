export interface CreateEdgePayload {
  inNodeId: string;
  outNodeId: string;
}

export interface DeleteEdgePayload {
  inNodeId: string;
  outNodeId: string;
}

export interface CreateEdgeAcrossFloorsPayload {
  outFloorCode: string;
  inNodeId: string;
  outNodeId: string;
}

export interface DeleteEdgeAcrossFloorsPayload {
  outFloorCode: string;
  inNodeId: string;
  outNodeId: string;
}
