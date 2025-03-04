import { toast } from "react-toastify";

import { ID, NodeInfo, Nodes } from "../../../../shared/types";
import { apiSlice } from "./apiSlice";
import { handleQueryError } from "./errorHandler";

export interface CreateNodeArgType {
  socketId: string;
  floorCode: string;
  nodeId: ID;
  nodeInfo: NodeInfo;
  addToHistory?: boolean;
}

export const nodeApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFloorNodes: builder.query<Nodes, string>({
      query: (floorCode) => `nodes/?floorCode=${floorCode}`,
    }),
    createNode: builder.mutation<Response, CreateNodeArgType>({
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
            nodeApiSlice.util.updateQueryData(
              "getFloorNodes",
              floorCode,
              (draft) => {
                draft[nodeId] = nodeInfo;
              },
            ),
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
