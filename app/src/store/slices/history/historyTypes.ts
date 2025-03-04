import { CreateNodeArg, DeleteNodeArg } from "../../api/nodeApiSlice";

interface CreateNodeEdit {
  endpoint: "createNode";
  arg: CreateNodeArg;
}

interface DeleteNodeEdit {
  endpoint: "deleteNode";
  arg: DeleteNodeArg;
}

export type Edit = CreateNodeEdit | DeleteNodeEdit;

export interface EditPair {
  edit: Edit;
  reverseEdit: Edit;
}
