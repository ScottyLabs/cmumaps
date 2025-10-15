import type { Graph, Placement, Pois, Rooms } from "@cmumaps/common";

import { apiSlice } from "./apiSlice";

export const floorDataApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFloorPlacement: builder.query<Placement, string>({
      query: (floorCode) => `floors/${floorCode}/placement`,
    }),
    getFloorGraph: builder.query<Graph, string>({
      query: (floorCode) => `floors/${floorCode}/graph`,
      providesTags: ["Graph"],
      keepUnusedDataFor: 0,
    }),
    getFloorRooms: builder.query<Rooms, string>({
      query: (floorCode) => `floors/${floorCode}/rooms`,
      providesTags: ["Rooms"],
      keepUnusedDataFor: 0,
    }),
    getFloorPois: builder.query<Pois, string>({
      query: (floorCode) => `floors/${floorCode}/pois`,
      providesTags: ["Pois"],
      keepUnusedDataFor: 0,
    }),
    invalidateCache: builder.mutation<unknown, void>({
      queryFn: () => ({ data: null }),
      invalidatesTags: ["Graph", "Rooms", "Pois"],
    }),
  }),
});

export const {
  useGetFloorPlacementQuery,
  useGetFloorGraphQuery,
  useGetFloorRoomsQuery,
  useGetFloorPoisQuery,
  useInvalidateCacheMutation,
} = floorDataApiSlice;
