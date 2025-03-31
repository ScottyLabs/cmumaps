import { EventType } from "@cmumaps/common";

import { apiSlice } from "@/store/features/api/apiSlice";

interface EventResponse {
  events: EventType[];
  prevEventId: string;
  nextEventId: string;
}

interface GetEventsQuery {
  filter: string[];
  reqs: string[];
}

// either eventId or timestamp must be provided
interface PageParam {
  timestamp?: number;
  eventId?: string;
  direction?: "future" | "past";
}

export const eventApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getEvents: builder.infiniteQuery<EventResponse, GetEventsQuery, PageParam>({
      query: ({ queryArg, pageParam }) => ({
        url: `/events`,
        params: {
          filter: queryArg.filter,
          timestamp: pageParam.timestamp,
          eventId: pageParam.eventId,
          direction: pageParam.direction,
          limit: 10,
        },
      }),
      infiniteQueryOptions: {
        initialPageParam: {
          timestamp: Date.now(),
        },
        getNextPageParam: (lastPage) => {
          if (lastPage.nextEventId) {
            return {
              eventId: lastPage.nextEventId,
              direction: "future",
            };
          }
        },
        getPreviousPageParam: (firstPage) => {
          if (firstPage.prevEventId) {
            return {
              eventId: firstPage.prevEventId,
              direction: "past",
            };
          }
        },
      },
    }),
  }),
});

export const { useGetEventsInfiniteQuery } = eventApiSlice;
