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
    }),
  }),
});

export const { useGetFloorNodesQuery, useCreateNodeMutation } = nodeApiSlice;
