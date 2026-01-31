import { useSession } from "@/lib/authClient";

const useUser = () => {
  const { data } = useSession();

  if (data?.user) {
    return data.user;
  }

  return null;
};

export { useUser };
