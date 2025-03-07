import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

declare global {
  interface Window {
    Clerk: {
      session: {
        getToken: () => Promise<string>;
      };
    };
  }
}

export interface BaseMutationArg {
  socketId: string;
  floorCode: string;
  addToHistory?: boolean;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/`,
    prepareHeaders: async (headers) => {
      const token = await window.Clerk.session.getToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
