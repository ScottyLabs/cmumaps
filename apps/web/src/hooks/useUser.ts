import $api from "@/api/client";

const useUser = () => {
  const { data } = $api.useQuery("get", "/auth/userInfo");
  const user = data?.user;
  const isCmuStudent = user?.email.match(/@andrew\.cmu\.edu$/);
  const isCmuAlias = user?.email.match(/@cmu\.edu$/);
  const isCmuAlumni = user?.email.match(/@alumni\.cmu\.edu$/);
  const isScottyLabs = user?.email.match(/@scottylabs\.org$/);
  const isSpecialGuest = user?.groups.includes("cmumaps-guests");
  return {
    isSignedIn: !!user,
    user,
    hasAccess:
      isCmuStudent ||
      isCmuAlias ||
      isCmuAlumni ||
      isScottyLabs ||
      isSpecialGuest,
  };
};

export default useUser;
