import { apiSlice } from './apiSlice';

export const buildingsApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBuildingCodes: builder.query<string[], void>({
      query: () => 'buildings/codes',
    }),
  }),
});

export const { useGetBuildingCodesQuery } = buildingsApiSlice;
