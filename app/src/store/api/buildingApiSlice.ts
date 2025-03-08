import { apiSlice } from "./apiSlice";

type BuildingCodeAndName = {
  buildingCode: string;
  name: string;
};

export const buildingApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBuildingCodesAndNames: builder.query<BuildingCodeAndName[], void>({
      query: () => "buildings/codes-and-names",
    }),
    getBuildingName: builder.query<string, string>({
      query: (id) => `buildings/${id}/name`,
    }),
    getDefaultFloor: builder.query<string, string>({
      query: (id) => `buildings/${id}/defaultFloor`,
    }),
    getBuildingFloors: builder.query<string[], string>({
      query: (id) => `buildings/${id}/floors`,
    }),
  }),
});

export const {
  useGetBuildingCodesAndNamesQuery,
  useGetBuildingNameQuery,
  useGetDefaultFloorQuery,
  useGetBuildingFloorsQuery,
} = buildingApiSlice;
