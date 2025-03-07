import { toast } from "react-toastify";

import { Nodes } from "../../../../shared/types";
import {
  CreateNodePayload,
  DeleteNodePayload,
  UpdateNodePayload,
} from "../../../../shared/webSocketTypes";
import { addEditToHistory } from "../features/history/historySlice";
import {
  buildCreateEditPair,
  buildDeleteEditPair,
} from "../features/history/historyUtils";
import { getSocketId } from "../middleware/webSocketMiddleware";
import { AppDispatch, RootState } from "../store";
import { apiSlice, BaseMutationArg } from "./apiSlice";
import { handleQueryError } from "./errorHandler";

export type CreateNodeArg = BaseMutationArg & CreateNodePayload;
export type DeleteNodeArg = BaseMutationArg & DeleteNodePayload;
export type UpdateNodeArg = BaseMutationArg & UpdateNodePayload;

export const createNode =
  (floorCode: string, { nodeId, nodeInfo }: CreateNodePayload) =>
  (dispatch: AppDispatch) =>
    dispatch(
      nodeApiSlice.util.updateQueryData("getFloorNodes", floorCode, (draft) => {
        draft[nodeId] = nodeInfo;
      }),
    );

export const deleteNode =
  (floorCode: string, { nodeId }: DeleteNodePayload) =>
  (dispatch: AppDispatch) =>
    dispatch(
      nodeApiSlice.util.updateQueryData("getFloorNodes", floorCode, (draft) => {
        delete draft[nodeId];
      }),
    );

export const nodeApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFloorNodes: builder.query<Nodes, string>({
      query: (floorCode) => `nodes/?floorCode=${floorCode}`,
    }),
    createNode: builder.mutation<Response, CreateNodeArg>({
      query: ({ floorCode, nodeId, nodeInfo }) => ({
        url: `nodes/${nodeId}`,
        method: "POST",
        body: { floorCode, nodeInfo },
        headers: { "X-Socket-ID": getSocketId() },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { floorCode, nodeId, addToHistory, nodeInfo } = arg;
          // add to history
          if (addToHistory) {
            const editPair = buildCreateEditPair(arg);
            dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(
            createNode(floorCode, { nodeId, nodeInfo }),
          );
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),
    deleteNode: builder.mutation<Response, DeleteNodeArg>({
      query: ({ nodeId }) => ({
        url: `nodes/${nodeId}`,
        method: "DELETE",
        headers: { "X-Socket-ID": getSocketId() },
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        try {
          const { floorCode, nodeId, addToHistory } = arg;
          // add to history
          if (addToHistory) {
            const getStore = getState as () => RootState;
            const editPair = await buildDeleteEditPair(arg, getStore, dispatch);
            dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(deleteNode(floorCode, { nodeId }));
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),
    updateNode: builder.mutation<Response, UpdateNodeArg>({
      query: ({ floorCode, nodeId, nodeInfo }) => ({
        url: `nodes/${nodeId}`,
        method: "PUT",
        body: { floorCode, nodeInfo },
        headers: { "X-Socket-ID": getSocketId() },
      }),
    }),
  }),
});

export const {
  useGetFloorNodesQuery,
  useCreateNodeMutation,
  useDeleteNodeMutation,
  useUpdateNodeMutation,
} = nodeApiSlice;
