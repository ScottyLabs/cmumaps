import { apiSlice } from "./apiSlice";

type BuildingCodeAndName = {
  buildingCode: string;
  name: string;
};

export const buildingApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBuildingCodesAndNames: builder.query<BuildingCodeAndName[], string>({
      query: (token) => ({
        url: "buildings/codes-and-names",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
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
  useGetDefaultFloorQuery,
  useGetBuildingFloorsQuery,
} = buildingApiSlice;
