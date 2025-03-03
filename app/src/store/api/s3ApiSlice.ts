import { apiSlice } from "./apiSlice";

export const AWS_API_INVOKE_URL = `${import.meta.env.VITE_AWS_API_INVOKE_URL}/${import.meta.env.MODE}`;

interface WithTokenArgType {
  filePath: string;
  token: string;
}

export const s3ApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFloorPdf: builder.query<string, WithTokenArgType>({
      query: ({ filePath, token }) => ({
        url: `${AWS_API_INVOKE_URL}/get-floorplan?filePath=${filePath}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: { data: string }) => response.data,
    }),
  }),
});

export const { useGetFloorPdfQuery } = s3ApiSlice;
