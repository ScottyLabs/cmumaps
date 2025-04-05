import { Buildings, EventType, GeoRooms } from "@cmumaps/common";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getClerkToken = async () => {
  if (window.Clerk && window.Clerk.session) {
    const token = await window.Clerk.session.getToken();
    return token;
  }
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/`,
    prepareHeaders: async (headers) => {
      if (window.Clerk && window.Clerk.session) {
        const token = await getClerkToken();
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getBuildings: builder.query<Buildings, void>({
      query: () => "/buildings",
    }),
    getFloorRooms: builder.query<GeoRooms, string>({
      query: (floorCode) => `/floors/${floorCode}/floorplan`,
    }),
    search: builder.query<EventType[], string>({
      query: (searchQuery) => ({
        url: "https://lzy9qzekt7.execute-api.us-east-2.amazonaws.com/default/carnival-search",
        params: {
          query: searchQuery,
        },
      }),
      transformResponse: (response: EventType[]) =>
        response.map((event) => ({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          id: event.eventId,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          name: event.title,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          startTime: event.startDateTime,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          endTime: event.endDateTime,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          location: event.locationName,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          description: event.description,
          latitude: event.latitude,
          longitude: event.longitude,
          tracks: event.tracks,
        })),
    }),
  }),
});

export const { useGetBuildingsQuery, useGetFloorRoomsQuery, useSearchQuery } =
  apiSlice;
