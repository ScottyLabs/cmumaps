import { ID, NodeInfo, Nodes } from '../../../../shared/types';
import { apiSlice } from './apiSlice';

export interface CreateNodeArgType {
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
      query: ({ nodeId, nodeInfo }) => ({
        url: `nodes/${nodeId}`,
        method: 'POST',
        body: nodeInfo,
      }),
    }),
  }),
});

export const { useGetFloorNodesQuery, useCreateNodeMutation } = nodeApiSlice;
