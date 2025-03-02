import { apiSlice } from './apiSlice';

export const buildingsApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBuildingCodes: builder.query<string[], void>({
      query: () => 'buildings/codes',
    }),
    getDefaultFloor: builder.query<string, string>({
      query: (id) => `buildings/${id}/defaultFloor`,
    }),
  }),
});

export const { useGetBuildingCodesQuery, useGetDefaultFloorQuery } =
  buildingsApiSlice;
