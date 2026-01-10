import { $api } from "@/api/client";

const useUser = () => {
  const { data } = $api.useQuery("get", "/auth/me");

  if (data?.user) {
    return data.user;
  }

  return null;
};

export { useUser };
