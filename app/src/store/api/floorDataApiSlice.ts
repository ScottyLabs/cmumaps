import { Graph } from "../../../../shared/types";
import { apiSlice } from "./apiSlice";

export const floorDataApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFloorGraph: builder.query<Graph, string>({
      query: (floorCode) => `floors/${floorCode}/graph`,
      providesTags: ["Graph"],
      keepUnusedDataFor: 0,
    }),
    invalidateCache: builder.mutation<unknown, void>({
      queryFn: () => ({ data: null }),
      invalidatesTags: ["Graph"],
    }),
  }),
});

export const { useGetFloorGraphQuery, useInvalidateCacheMutation } =
  floorDataApiSlice;
