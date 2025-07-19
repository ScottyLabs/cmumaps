import { useSession } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const useClerkToken = () => {
  const { session } = useSession();
  const [token, setToken] = useState<string | null | undefined>(null);

  useEffect(() => {
    (async () => {
      const token = await session?.getToken();
      setToken(token);
    })();
  }, [session]);

  return token;
};

export default useClerkToken;
