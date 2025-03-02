import { useSession } from '@clerk/clerk-react';

import { useEffect, useState } from 'react';

const useClerkToken = () => {
  const { session, isLoaded } = useSession();
  const [token, setToken] = useState<string | null | undefined>(null);

  useEffect(() => {
    (async () => {
      const token = await session?.getToken();
      setToken(token);
    })();
  }, [isLoaded, session]);

  return token;
};

export default useClerkToken;
