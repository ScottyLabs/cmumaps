type QueryKey = ["buildings"] | ["rooms", string] | [];

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: QueryKey;
    mutationKey: QueryKey;
  }
}

const getClerkToken = async () => {
  if (window.Clerk && window.Clerk.session) {
    return await window.Clerk.session.getToken();
  }
  return null;
};

export const apiClient = (endpoint: string) => async () => {
  const token = await getClerkToken();
  const headers = { Authorization: `Bearer ${token}` };
  const endpointUrl = `${import.meta.env.VITE_SERVER_URL}/api/${endpoint}`;
  const response = await fetch(endpointUrl, { headers });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
};
