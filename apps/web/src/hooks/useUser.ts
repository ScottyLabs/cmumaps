import { useUser as useClerkUser } from "@clerk/clerk-react";

const useUser = () => {
  const { isSignedIn, user } = useClerkUser();
  const primaryEmail = user?.primaryEmailAddress?.emailAddress;
  const imageUrl = user?.imageUrl;
  const isCmuStudent = primaryEmail?.match(/@andrew\.cmu\.edu$/);
  const isCmuAlias = primaryEmail?.match(/@cmu\.edu$/);
  const isCmuAlumni = primaryEmail?.match(/@alumni\.cmu\.edu$/);
  const isScottyLabs = primaryEmail?.match(/@scottylabs\.org$/);
  const isSpecialGuest = user?.publicMetadata["isSpecialGuest"];
  return {
    isSignedIn,
    user: {
      id: user?.id,
      name: user?.fullName,
      email: primaryEmail,
    },
    email: primaryEmail,
    imageUrl,
    hasAccess:
      isCmuStudent ||
      isCmuAlias ||
      isCmuAlumni ||
      isScottyLabs ||
      isSpecialGuest,
  };
};

export default useUser;
