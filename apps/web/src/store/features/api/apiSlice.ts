import { BuildingInfo } from "@cmumaps/common";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/`,
  }),
  endpoints: (builder) => ({
    getBuildingInfos: builder.query<BuildingInfo[], void>({
      query: () => "/buildings",
    }),
  }),
});

export const { useGetBuildingInfosQuery } = apiSlice;
