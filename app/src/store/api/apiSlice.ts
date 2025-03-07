import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface BaseMutationArg {
  floorCode: string;
  batchId: string | null;
  // batchId is for undo/redo a group of edits
  // if null, it won't be added to the history
}

export const getClerkToken = async () => {
  if (window.Clerk && window.Clerk.session) {
    const token = await window.Clerk.session.getToken();
    return token;
  }
};

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Graph", "Rooms"],
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
  endpoints: () => ({}),
});
