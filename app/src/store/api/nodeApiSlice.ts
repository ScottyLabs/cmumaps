import { Nodes } from '../../../../shared/types';
import { apiSlice } from './apiSlice';

export const nodeApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFloorNodes: builder.query<Nodes, string>({
      query: (floorCode) => `nodes/?floorCode=${floorCode}`,
    }),
  }),
});

export const { useGetFloorNodesQuery } = nodeApiSlice;
