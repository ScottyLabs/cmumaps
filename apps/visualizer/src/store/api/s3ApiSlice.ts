import { DoorInfo } from "@cmumaps/common";

import { apiSlice } from "./apiSlice";

export const AWS_API_INVOKE_URL = `${import.meta.env.VITE_AWS_API_INVOKE_URL}/${import.meta.env.MODE}`;

interface OutlineData {
  walls: number[][];
  doors: Record<string, DoorInfo>;
  roomlessDoors: number[][];
}

export const s3ApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFloorPdf: builder.query<string, string>({
      query: (filePath) =>
        `${AWS_API_INVOKE_URL}/get-floorplan-pdf?filePath=${filePath}`,
      transformResponse: (response: { data: string }) => response.data,
    }),
    getFloorOutline: builder.query<OutlineData, string>({
      query: (filePath) =>
        `${AWS_API_INVOKE_URL}/get-floorplan-outline?filePath=${filePath}`,
      transformResponse: (response: { data: OutlineData }) => response.data,
    }),
  }),
});

export const { useGetFloorPdfQuery, useGetFloorOutlineQuery } = s3ApiSlice;
