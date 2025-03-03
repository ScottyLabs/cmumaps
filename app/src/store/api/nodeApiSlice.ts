import { toast } from 'react-toastify';

import { ID, NodeInfo, Nodes } from '../../../../shared/types';
import { apiSlice } from './apiSlice';

export interface CreateNodeArgType {
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
      query: ({ floorCode, nodeId, nodeInfo }) => ({
        url: `nodes/${nodeId}`,
        method: 'POST',
        body: { floorCode, nodeInfo },
      }),
      async onQueryStarted(
        { floorCode, nodeId, nodeInfo },
        { dispatch, queryFulfilled },
      ) {
        try {
          // optimistic update
          const { undo } = dispatch(
            nodeApiSlice.util.updateQueryData(
              'getFloorNodes',
              floorCode,
              (draft) => {
                draft[nodeId] = nodeInfo;
              },
            ),
          );

          // different error handling for queryFulfilled
          try {
            await queryFulfilled;
          } catch (e) {
            toast.error(
              'Failed to save! Check the Console for detailed error.',
            );
            undo();
            const error = e as { error: { data: { error: string } } };
            console.error(error.error.data.error);
          }
        } catch (e) {
          toast.error('Check the Console for detailed error.');
          console.error(e);
        }
      },
    }),
  }),
});

export const { useGetFloorNodesQuery, useCreateNodeMutation } = nodeApiSlice;
