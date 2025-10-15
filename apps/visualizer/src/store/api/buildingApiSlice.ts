import type { Building, BuildingMetadata } from "@cmumaps/common";
import { apiSlice } from "./apiSlice";

export const buildingApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBuilding: builder.query<Building, string>({
      query: (id) => `buildings/${id}`,
    }),
    getBuildingsMetadata: builder.query<BuildingMetadata[], void>({
      query: () => "buildings/metadata",
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
  useGetBuildingQuery,
  useGetBuildingsMetadataQuery,
  useGetBuildingNameQuery,
  useGetDefaultFloorQuery,
  useGetBuildingFloorsQuery,
} = buildingApiSlice;
