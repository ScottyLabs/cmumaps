import $api from "@/api/client";

const useUser = () => {
  const { data } = $api.useQuery("get", "/auth/userInfo");
  const user = data?.user;
  const isCMU = user?.email.match(/@andrew\.cmu\.edu$/);
  return { isSignedIn: !!user, user, isCMU: !!isCMU };
};

export default useUser;
