import type { Buildings, GeoRooms } from "@cmumaps/common";
import { queryOptions, skipToken } from "@tanstack/react-query";
import env from "@/env";

type QueryKey = ["buildings"] | ["rooms", string | null] | [];

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: QueryKey;
  }
}

const getClerkToken = async () => {
  if (window.Clerk?.session) {
    return await window.Clerk.session.getToken();
  }
  return null;
};

const apiClient = async (endpoint: string) => {
  const token = await getClerkToken();
  const headers = { Authorization: `Bearer ${token}` };
  const endpointUrl = `${env.VITE_SERVER_URL}/api/${endpoint}`;
  const response = await fetch(endpointUrl, { headers });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
};

export const getBuildingsQueryOptions = () =>
  queryOptions<Buildings>({
    queryKey: ["buildings"],
    queryFn: () => apiClient("buildings"),
  });

export const getRoomsQueryOptions = (floorCode: string | null) =>
  queryOptions<GeoRooms>({
    queryKey: ["rooms", floorCode],
    queryFn: floorCode
      ? () => apiClient(`floors/${floorCode}/floorplan`)
      : skipToken,
  });
