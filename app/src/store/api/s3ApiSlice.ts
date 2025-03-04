import { DoorInfo, ID } from "../../../../shared/types";
import { apiSlice } from "./apiSlice";

export const AWS_API_INVOKE_URL = `${import.meta.env.VITE_AWS_API_INVOKE_URL}/${import.meta.env.MODE}`;

interface WithTokenArg {
  filePath: string;
  token: string;
}

interface OutlineData {
  walls: number[][];
  doors: Record<ID, DoorInfo>;
  roomlessDoors: number[][];
}

export const s3ApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFloorPdf: builder.query<string, WithTokenArg>({
      query: ({ filePath, token }) => ({
        url: `${AWS_API_INVOKE_URL}/get-floorplan-pdf?filePath=${filePath}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: { data: string }) => response.data,
    }),
    getFloorOutline: builder.query<OutlineData, WithTokenArg>({
      query: ({ filePath, token }) => ({
        url: `${AWS_API_INVOKE_URL}/get-floorplan-outline?filePath=${filePath}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: { data: OutlineData }) => response.data,
    }),
  }),
});

export const { useGetFloorPdfQuery, useGetFloorOutlineQuery } = s3ApiSlice;
