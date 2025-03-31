import { apiSlice } from "@/store/features/api/apiSlice";

export const eventApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getEvents: builder.infiniteQuery<number[], void, number>({
      query: (pageParam) => ({
        url: `/events`,
        params: { page: pageParam },
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (_lastPage, _allPages, firstPageParam) => {
          return firstPageParam + 1;
        },
        getPreviousPageParam: (_firstPage, _allPages, lastPageParam) => {
          return lastPageParam - 1;
        },
      },
    }),
  }),
});

export const { useGetEventsInfiniteQuery } = eventApiSlice;
