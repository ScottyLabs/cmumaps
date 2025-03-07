import { Nodes } from "../../../../shared/types";
import { apiSlice } from "./apiSlice";

export const floorDataApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFloorNodes: builder.query<Nodes, string>({
      query: (floorCode) => `floors/${floorCode}/nodes`,
    }),
  }),
});

export const { useGetFloorNodesQuery } = floorDataApiSlice;
