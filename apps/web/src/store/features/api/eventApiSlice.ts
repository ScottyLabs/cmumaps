import {
  CurrentEventResponse,
  EventResponse,
  EventsResponse,
} from "@cmumaps/common";

import { apiSlice } from "@/store/features/api/apiSlice";

interface GetEventsQuery {
  filters: string[];
  reqs: string[];
  timestamp?: number;
}

// either eventId or timestamp must be provided
interface PageParam {
  eventId?: string;
  timestamp?: number;
  startTime?: number;
  endTime?: number;
  direction?: "future" | "past";
}

export const eventApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getEvent: builder.query<EventResponse, string>({
      query: (eventId) => ({
        url: `/events/${eventId}`,
      }),
    }),
    getCurrentEvent: builder.query<CurrentEventResponse, GetEventsQuery>({
      query: ({ timestamp, filters, reqs }) => ({
        url: `/events/current`,
        params: { timestamp, filters, reqs },
      }),
    }),
    getEvents: builder.infiniteQuery<EventsResponse, GetEventsQuery, PageParam>(
      {
        query: ({ queryArg, pageParam }) => ({
          url: `/events`,
          params: {
            timestamp: pageParam.timestamp,
            eventId: pageParam.eventId,
            startTime: pageParam.startTime,
            endTime: pageParam.endTime,
            direction: pageParam.direction,
            limit: 10,
            filters: queryArg.filters,
            reqs: queryArg.reqs,
          },
        }),
        infiniteQueryOptions: {
          initialPageParam: {
            timestamp: Date.now(),
          },
          getNextPageParam: (lastPage) => {
            if (lastPage.nextEvent) {
              return {
                eventId: lastPage.nextEvent.id,
                startTime: new Date(lastPage.nextEvent.startTime).getTime(),
                endTime: new Date(lastPage.nextEvent.endTime).getTime(),
                direction: "future",
              };
            }
          },
          getPreviousPageParam: (firstPage) => {
            if (firstPage.prevEvent) {
              return {
                eventId: firstPage.prevEvent.id,
                startTime: new Date(firstPage.prevEvent.startTime).getTime(),
                endTime: new Date(firstPage.prevEvent.endTime).getTime(),
                direction: "past",
              };
            }
          },
        },
      },
    ),
  }),
});

export const {
  useGetEventsInfiniteQuery,
  useGetEventQuery,
  useGetCurrentEventQuery,
} = eventApiSlice;
