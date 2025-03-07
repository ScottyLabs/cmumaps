import { CreateEdgeArg, DeleteEdgeArg } from "../../api/edgeApiSlice";
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

export type Edit =
  | CreateNodeEdit
  | DeleteNodeEdit
  | UpdateNodeEdit
  | CreateEdgeEdit
  | DeleteEdgeEdit;

export interface EditPair {
  batchId: string;
  edit: Edit;
  reverseEdit: Edit;
}
