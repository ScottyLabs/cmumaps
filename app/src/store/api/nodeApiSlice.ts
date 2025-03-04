import { toast } from "react-toastify";

import { Nodes } from "../../../../shared/types";
import { CreateNodePayload } from "../../../../shared/webSocketTypes";
import { AppDispatch } from "../store";
import { apiSlice, BaseMutationArg } from "./apiSlice";
import { handleQueryError } from "./errorHandler";

export type CreateNodeArg = BaseMutationArg & CreateNodePayload;

export const createNode =
  (floorCode: string, { nodeId, nodeInfo }: CreateNodePayload) =>
  (dispatch: AppDispatch) =>
    dispatch(
      nodeApiSlice.util.updateQueryData("getFloorNodes", floorCode, (draft) => {
        draft[nodeId] = nodeInfo;
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
        { floorCode, nodeId, nodeInfo },
        { dispatch, queryFulfilled },
      ) {
        try {
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
  }),
});

export const { useGetFloorNodesQuery, useCreateNodeMutation } = nodeApiSlice;
