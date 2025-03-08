import {
  CreateEdgeAcrossFloorsArg,
  CreateEdgeArg,
  DeleteEdgeAcrossFloorsArg,
  DeleteEdgeArg,
} from "../../api/edgeApiSlice";
import {
  CreateNodeArg,
  DeleteNodeArg,
  UpdateNodeArg,
} from "../../api/nodeApiSlice";

interface CreateNodeEdit {
  endpoint: "createNode";
  arg: CreateNodeArg;
}

interface DeleteNodeEdit {
  endpoint: "deleteNode";
  arg: DeleteNodeArg;
}

interface UpdateNodeEdit {
  endpoint: "updateNode";
  arg: UpdateNodeArg;
}

interface CreateEdgeEdit {
  endpoint: "createEdge";
  arg: CreateEdgeArg;
}

interface DeleteEdgeEdit {
  endpoint: "deleteEdge";
  arg: DeleteEdgeArg;
}

interface CreateEdgeAcrossFloorsEdit {
  endpoint: "createEdgeAcrossFloors";
  arg: CreateEdgeAcrossFloorsArg;
}

interface DeleteEdgeAcrossFloorsEdit {
  endpoint: "deleteEdgeAcrossFloors";
  arg: DeleteEdgeAcrossFloorsArg;
}

export type Edit =
  | CreateNodeEdit
  | DeleteNodeEdit
  | UpdateNodeEdit
  | CreateEdgeEdit
  | DeleteEdgeEdit
  | CreateEdgeAcrossFloorsEdit
  | DeleteEdgeAcrossFloorsEdit;

export interface EditPair {
  batchId: string;
  edit: Edit;
  reverseEdit: Edit;
}
