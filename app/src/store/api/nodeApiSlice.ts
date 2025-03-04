import { toast } from "react-toastify";

import { Nodes } from "../../../../shared/types";
import {
  CreateNodePayload,
  DeleteNodePayload,
} from "../../../../shared/webSocketTypes";
import { addEditToHistory } from "../features/history/historySlice";
import { EditPair } from "../features/history/historyTypes";
import { AppDispatch } from "../store";
import { apiSlice, BaseMutationArg } from "./apiSlice";
import { handleQueryError } from "./errorHandler";

export type CreateNodeArg = BaseMutationArg & CreateNodePayload;
export type DeleteNodeArg = BaseMutationArg & DeleteNodePayload;

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
      query: ({ socketId, floorCode, nodeId, nodeInfo }) => ({
        url: `nodes/${nodeId}`,
        method: "POST",
        body: { socketId, floorCode, nodeInfo },
      }),
      async onQueryStarted(
        { socketId, floorCode, nodeId, addToHistory, nodeInfo },
        { dispatch, queryFulfilled },
      ) {
        try {
          // optimistic update
          const { undo } = dispatch(
            createNode(floorCode, { nodeId, nodeInfo }),
          );
          if (addToHistory) {
            const edit: EditPair = {
              edit: {
                endpoint: "createNode",
                arg: {
                  socketId,
                  floorCode,
                  nodeId,
                  nodeInfo,
                },
              },
              reverseEdit: {
                endpoint: "deleteNode",
                arg: {
                  socketId,
                  floorCode,
                  nodeId,
                },
              },
            };
            dispatch(addEditToHistory(edit));
          }
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),
    deleteNode: builder.mutation<Response, DeleteNodeArg>({
      query: ({ socketId, nodeId }) => ({
        url: `nodes/${nodeId}`,
        method: "DELETE",
        headers: { "X-Socket-ID": socketId },
      }),
      async onQueryStarted(
        { floorCode, nodeId },
        { dispatch, queryFulfilled },
      ) {
        try {
          // optimistic update
          const { undo } = dispatch(deleteNode(floorCode, { nodeId }));
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),
  }),
});

export const {
  useGetFloorNodesQuery,
  useCreateNodeMutation,
  useDeleteNodeMutation,
} = nodeApiSlice;
