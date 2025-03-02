import { apiSlice } from './apiSlice';

type BuildingCodeAndName = {
  buildingCode: string;
  name: string;
};

export const buildingsApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBuildingCodesAndNames: builder.query<BuildingCodeAndName[], void>({
      query: () => 'buildings/codes-and-names',
    }),
    getDefaultFloor: builder.query<string, string>({
      query: (id) => `buildings/${id}/defaultFloor`,
    }),
  }),
});

export const { useGetBuildingCodesAndNamesQuery, useGetDefaultFloorQuery } =
  buildingsApiSlice;
