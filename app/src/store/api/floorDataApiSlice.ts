import { Nodes } from "../../../../shared/types";
import { apiSlice } from "./apiSlice";

export const floorDataApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFloorNodes: builder.query<Nodes, string>({
      query: (floorCode) => `floors/${floorCode}/graph`,
      providesTags: ["Nodes"],
    }),
    invalidateCache: builder.mutation<unknown, void>({
      queryFn: () => ({ data: null }),
      invalidatesTags: ["Nodes"],
    }),
  }),
});

export const { useGetFloorNodesQuery, useInvalidateCacheMutation } =
  floorDataApiSlice;
